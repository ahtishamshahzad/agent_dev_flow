#!/usr/bin/env node
'use strict';

/**
 * Repo consistency validator. Zero dependencies. Run: node scripts/validate.js
 *
 * Checks:
 *   1. All JSON manifests parse, and every version matches .ai/VERSION.
 *   2. Every SKILL.md has frontmatter with name and description.
 *   3. Every plugin's skills/ symlink resolves and contains skills.
 *   4. Every count claimed in prose — totals and per-pack, in README.md,
 *      USAGE.md, .ai/README.md, .ai/skills/README.md, plugins/README.md and
 *      marketplace.json — matches what is actually on disk. A claim that no
 *      longer matches its pattern fails too: a check that silently stops
 *      checking is worse than no check.
 *   5. CHANGELOG's newest entry is the current VERSION, its totals agree with
 *      the repo, and .ai/README.md quotes the same version.
 *   6. Every file the installer bundles exists.
 *   7. Every relative path referenced from a Markdown file under .ai/ resolves
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

// ---- 3. Plugin symlinks ---------------------------------------------------
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
  }
}

// ---- 4. Claimed counts ----------------------------------------------------
// Everything countable, counted once from disk. Prose claims are checked
// against these — the numbers in the docs drifted before precisely because
// only three of them were ever verified.
const mdIn = (rel, keep) =>
  fs.readdirSync(path.join(ROOT, rel)).filter((f) => f.endsWith('.md') && keep(f));
const notIndex = (f) => f !== 'README.md';

// Agent role files declare themselves ("# Agent: Architect"); the index and the
// execution-modes doc live in the same folder but are not roles.
const isRole = (f) => read(`.ai/agents/${f}`).startsWith('# Agent:');

// Skills: a directory holding SKILL.md is one skill; anything else under
// .ai/skills/ is a pack of them.
const packs = {};
let coreSkills = 0;
for (const name of fs.readdirSync(skillsRoot)) {
  const dir = path.join(skillsRoot, name);
  if (!fs.statSync(dir).isDirectory()) continue;
  if (fs.existsSync(path.join(dir, 'SKILL.md'))) coreSkills++;
  else packs[name] = skillCount(dir);
}
packs.core = coreSkills;

const counts = {
  skills: skillFiles.length,
  agents: mdIn('.ai/agents', (f) => notIndex(f) && isRole(f)).length,
  hooks: mdIn('.ai/hooks', (f) => /^(before|after)-/.test(f)).length,
  workflows: mdIn('.ai/workflows', notIndex).length,
  templates: mdIn('.ai/templates', notIndex).length,
  prompts: mdIn('.ai/prompts', notIndex).length,
  checklists: mdIn('.ai/checklists', notIndex).length,
};

// "Web & Dashboard" and "web & dashboard" both name the web pack.
const packKey = (label) => label.toLowerCase().trim().split(/\s*&\s*/)[0].trim();

// Each claim must match at least once (a reworded doc must not silently stop
// being checked) and every match must equal the real count.
function claim(rel, what, re, expected) {
  const flags = re.flags.includes('g') ? re.flags : re.flags + 'g';
  const found = [...read(rel).matchAll(new RegExp(re.source, flags))];
  if (!found.length) {
    fail(`${rel}: no longer states the ${what} count — update the check or restore the claim`);
    return;
  }
  for (const m of found) {
    if (Number(m[1]) !== expected) fail(`${rel}: claims ${m[1]} ${what}, found ${expected}`);
  }
}

// Root README — the "What's inside" table and the pack sentence.
claim('README.md', 'skills', /\|\s*\*\*Skills\*\*[^|]*\|\s*\*\*(\d+)\*\*/, counts.skills);
for (const key of ['Agents', 'Hooks', 'Workflows', 'Templates', 'Prompts', 'Checklists']) {
  claim('README.md', key.toLowerCase(),
    new RegExp(`\\|\\s*\\*\\*${key}\\*\\*[^|]*\\|\\s*(\\d+)\\s*\\|`), counts[key.toLowerCase()]);
}
const packSentence = read('README.md').match(/\*\*8 packs\*\*:([^.]+)\./);
if (!packSentence) {
  fail('README.md: pack breakdown sentence not found — update the check or restore it');
} else {
  for (const [, label, n] of packSentence[1].matchAll(/([a-z &]+)\((\d+)\)/g)) {
    const key = packKey(label);
    if (!(key in packs)) fail(`README.md: unknown pack "${label.trim()}"`);
    else if (Number(n) !== packs[key]) fail(`README.md: claims ${n} ${key} skills, found ${packs[key]}`);
  }
}

// .ai/README.md architecture bullets.
claim('.ai/README.md', 'skills', /\*\*`skills\/`\*\*\s*—\s*(\d+)/, counts.skills);
claim('.ai/README.md', 'agents', /\*\*`agents\/`\*\*\s*—\s*(\d+)/, counts.agents);
claim('.ai/README.md', 'hooks', /\*\*`hooks\/`\*\*\s*—\s*(\d+)/, counts.hooks);
claim('.ai/README.md', 'workflows', /\*\*`workflows\/`\*\*\s*—\s*(\d+)/, counts.workflows);

// USAGE.md "Where things live".
claim('USAGE.md', 'skills', /\|\s*`\.ai\/skills\/`\s*\|\s*(\d+)/, counts.skills);
claim('USAGE.md', 'agents', /\|\s*`\.ai\/agents\/`\s*\|\s*(\d+)/, counts.agents);

// .ai/skills/README.md pack table (no core row — core skills are listed individually).
const packRows = [...read('.ai/skills/README.md').matchAll(/\|\s*\*\*([A-Za-z &]+)\*\*\s*\((\d+) skills\)/g)];
if (!packRows.length) fail('.ai/skills/README.md: pack table no longer states skill counts');
for (const [, label, n] of packRows) {
  const key = packKey(label);
  if (!(key in packs)) fail(`.ai/skills/README.md: unknown pack "${label.trim()}"`);
  else if (Number(n) !== packs[key]) {
    fail(`.ai/skills/README.md: claims ${n} ${key} skills, found ${packs[key]}`);
  }
}

// plugins/README.md — intro total and the per-plugin table.
claim('plugins/README.md', 'skills', /System's (\d+) skills/, counts.skills);
const pluginRows = [...read('plugins/README.md').matchAll(/\|\s*`(ai-[a-z]+)`\s*\|\s*(\d+)\s*\|/g)];
if (!pluginRows.length) fail('plugins/README.md: per-plugin table no longer states skill counts');
for (const [, name, claimed] of pluginRows) {
  if (!(name in packCounts)) fail(`plugins/README.md: "${name}" is not a plugin in marketplace.json`);
  else if (Number(claimed) !== packCounts[name]) {
    fail(`plugins/README.md ${name}: claims ${claimed} skills, found ${packCounts[name]}`);
  }
}

// marketplace.json — the catalogue description and each plugin description.
if (marketplace) {
  const top = /(\d+) reusable skills/.exec(marketplace.description || '');
  if (!top) fail('marketplace.json: description no longer states the skill total');
  else if (Number(top[1]) !== counts.skills) {
    fail(`marketplace.json: description claims ${top[1]} skills, found ${counts.skills}`);
  }
  for (const plugin of marketplace.plugins) {
    if (!(plugin.name in packCounts)) continue;
    const claimed = plugin.description.match(/\((\d+)\)/);
    if (!claimed) fail(`marketplace.json ${plugin.name}: description no longer states its skill count`);
    else if (Number(claimed[1]) !== packCounts[plugin.name]) {
      fail(`marketplace.json ${plugin.name}: claims ${claimed[1]} skills, found ${packCounts[plugin.name]}`);
    }
  }
}

// ---- 5. CHANGELOG <-> VERSION --------------------------------------------
// Skills were added twice without a version bump or an entry; both are now checked.
const changelog = read('.ai/CHANGELOG.md');
const newest = changelog.match(/^## \[(\d+\.\d+\.\d+)\]/m);
if (!newest) {
  fail('.ai/CHANGELOG.md: no versioned entry found');
} else if (newest[1] !== version) {
  fail(`.ai/CHANGELOG.md: newest entry is ${newest[1]}, .ai/VERSION is ${version} — bump one or write the entry`);
} else {
  // The newest entry describes the current release, so its totals are current.
  const section = changelog.slice(changelog.indexOf(newest[0]));
  const totals = section.match(/^- (\d+ skills(?: · \d+ [a-z]+)+)\./m);
  if (!totals) fail(`.ai/CHANGELOG.md [${version}]: no totals line`);
  else {
    for (const [, n, what] of totals[1].matchAll(/(\d+) ([a-z]+)/g)) {
      if (!(what in counts)) fail(`.ai/CHANGELOG.md: totals name unknown group "${what}"`);
      else if (Number(n) !== counts[what]) {
        fail(`.ai/CHANGELOG.md [${version}]: totals claim ${n} ${what}, found ${counts[what]}`);
      }
    }
  }
}
const quoted = read('.ai/README.md').match(/current system version \(semver\): \*\*(\d+\.\d+\.\d+)\*\*/);
if (!quoted) fail('.ai/README.md: no longer quotes the system version');
else if (quoted[1] !== version) {
  fail(`.ai/README.md: quotes version ${quoted[1]}, .ai/VERSION is ${version}`);
}

// ---- 6. Installer bundle completeness -------------------------------------
const bundled = [
  '.ai', 'AGENTS.md', 'CLAUDE.md', 'USAGE.md', 'QUICK_START.md',
  '.cursor/rules/project.mdc',
  '.windsurf/rules/project.md',
  '.github/copilot-instructions.md',
];
for (const rel of bundled) {
  if (!fs.existsSync(path.join(ROOT, rel))) fail(`installer source missing: ${rel}`);
}

// ---- 7. Relative references inside .ai/ resolve ---------------------------
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
console.log(
  `OK — version ${version}, ${counts.skills} skills, ${Object.keys(packCounts).length} plugins, ` +
  `${manifests.length} manifests, ${docs.length} docs, all claimed counts checked.`
);
