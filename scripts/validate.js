#!/usr/bin/env node
'use strict';

/**
 * Repo consistency validator. Zero dependencies. Run: node scripts/validate.js
 *
 * Checks:
 *   1. All JSON manifests parse, and every version matches .ai/VERSION.
 *   2. Every SKILL.md has frontmatter with name and description.
 *   3. Every plugin's skills/ symlink resolves and contains skills.
 *   4. Skill counts claimed in marketplace.json, plugins/README.md, and
 *      README.md match the actual counts in .ai/skills/.
 *   5. Every file the installer bundles exists.
 *   6. Every relative path referenced from a Markdown file under .ai/ resolves
 *      (catches skills pointing at reference folders that were never created).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const failures = [];
const fail = (msg) => failures.push(msg);
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// statSync follows symlinks, so broken links throw here and get reported.
function* walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function skillCount(dir) {
  return [...walk(dir)].filter((p) => p.endsWith('SKILL.md')).length;
}

// ---- 1. JSON validity + version sync -------------------------------------
const version = read('.ai/VERSION').trim();
const manifests = [
  'package.json',
  '.claude-plugin/marketplace.json',
  ...fs.readdirSync(path.join(ROOT, 'plugins'))
    .map((d) => `plugins/${d}/.claude-plugin/plugin.json`)
    .filter((p) => fs.existsSync(path.join(ROOT, p))),
];
const parsed = {};
for (const rel of manifests) {
  try {
    parsed[rel] = JSON.parse(read(rel));
  } catch (e) {
    fail(`${rel}: invalid JSON — ${e.message}`);
    continue;
  }
  if (parsed[rel].version !== version) {
    fail(`${rel}: version "${parsed[rel].version}" != .ai/VERSION "${version}"`);
  }
}

// ---- 2. Skill frontmatter -------------------------------------------------
const skillsRoot = path.join(ROOT, '.ai/skills');
const skillFiles = [...walk(skillsRoot)].filter((p) => p.endsWith('SKILL.md'));
for (const p of skillFiles) {
  const rel = path.relative(ROOT, p);
  const m = fs.readFileSync(p, 'utf8').match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) { fail(`${rel}: missing frontmatter block`); continue; }
  if (!/^name:\s*\S/m.test(m[1])) fail(`${rel}: frontmatter missing "name"`);
  if (!/^description:\s*\S/m.test(m[1])) fail(`${rel}: frontmatter missing "description"`);
}

// ---- 3 & 4. Plugin symlinks + claimed counts ------------------------------
const packCounts = {}; // plugin name -> actual SKILL.md count via its skills/ dir
const marketplace = parsed['.claude-plugin/marketplace.json'];
if (marketplace) {
  for (const plugin of marketplace.plugins) {
    const skillsDir = path.join(ROOT, plugin.source, 'skills');
    let count;
    try {
      count = skillCount(fs.realpathSync(skillsDir));
    } catch (e) {
      fail(`${plugin.name}: skills/ does not resolve — ${e.message}`);
      continue;
    }
    packCounts[plugin.name] = count;
    if (count === 0) fail(`${plugin.name}: skills/ resolves but contains no SKILL.md`);
    const claimed = plugin.description.match(/\((\d+)\)/);
    if (claimed && Number(claimed[1]) !== count) {
      fail(`marketplace.json ${plugin.name}: claims ${claimed[1]} skills, found ${count}`);
    }
  }
}

const pluginsReadme = read('plugins/README.md');
for (const [, name, claimed] of pluginsReadme.matchAll(/\|\s*`(ai-[a-z]+)`\s*\|\s*(\d+)\s*\|/g)) {
  if (name in packCounts && Number(claimed) !== packCounts[name]) {
    fail(`plugins/README.md ${name}: claims ${claimed} skills, found ${packCounts[name]}`);
  }
}

const total = skillCount(skillsRoot);
const readmeTotal = read('README.md').match(/\|\s*\*\*Skills\*\*[^|]*\|\s*\*\*(\d+)\*\*/);
if (readmeTotal && Number(readmeTotal[1]) !== total) {
  fail(`README.md: claims ${readmeTotal[1]} total skills, found ${total}`);
}

// ---- 5. Installer bundle completeness -------------------------------------
const bundled = [
  '.ai', 'AGENTS.md', 'CLAUDE.md', 'USAGE.md', 'QUICK_START.md',
  '.cursor/rules/project.mdc',
  '.windsurf/rules/project.md',
  '.github/copilot-instructions.md',
];
for (const rel of bundled) {
  if (!fs.existsSync(path.join(ROOT, rel))) fail(`installer source missing: ${rel}`);
}

// ---- 6. Relative references inside .ai/ resolve ---------------------------
// Skills cite sibling paths (`../../system/QUALITY_GATES.md`, `../references/<topic>/`).
// A wrong depth, or a folder that was never created, makes the agent read nothing.
const docs = [...walk(path.join(ROOT, '.ai'))].filter((p) => p.endsWith('.md'));
const REF = /`(\.\.\/[^`\s)]+)`|\]\((\.\.?\/[^)\s]+)\)/g;
for (const p of docs) {
  const text = fs.readFileSync(p, 'utf8');
  for (const m of text.matchAll(REF)) {
    const link = (m[1] || m[2]).split('#')[0];
    // Skip placeholders like `../references/<topic>/` — they name a pattern, not a path.
    if (!link || /[<>*|]/.test(link)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(p), link))) {
      fail(`${path.relative(ROOT, p)}: reference does not resolve — ${link}`);
    }
  }
}

// ---- Report ---------------------------------------------------------------
if (failures.length) {
  console.error(`FAIL — ${failures.length} problem(s):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`OK — version ${version}, ${total} skills, ${Object.keys(packCounts).length} plugins, ${manifests.length} manifests, ${docs.length} docs checked.`);
