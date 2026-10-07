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
// The list comes from the installer itself (ALWAYS + ADAPTERS), so adding a
// file there cannot silently skip this check. Each must exist on disk AND be
// covered by package.json "files" — otherwise `npx` installs fail even though
// running from a git checkout works.
const cli = read('bin/cli.js');
const block = (name) => {
  const m = cli.match(new RegExp(`const ${name} = ([\\[{][\\s\\S]*?[\\]}]);`));
  return m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [];
};
const bundled = [...block('ALWAYS'), ...block('ADAPTERS')];
if (block('ALWAYS').length < 2 || block('ADAPTERS').length < 4) {
  fail('bin/cli.js: could not read ALWAYS/ADAPTERS — update the check in validate.js');
}
const shipped = (parsed['package.json'] && parsed['package.json'].files) || [];
const covered = (rel) => shipped.some((f) => {
  const s = f.replace(/\/$/, '');
  return rel === s || rel.startsWith(s + '/');
});
for (const rel of bundled) {
  if (!fs.existsSync(path.join(ROOT, rel))) fail(`installer source missing: ${rel}`);
  if (!covered(rel)) fail(`package.json "files" does not ship installer source: ${rel}`);
}
if (!covered('bin/cli.js')) fail('package.json "files" does not ship bin/cli.js');

// ---- 6b. Node support claimed = Node support tested ------------------------
const engine = /(\d+)/.exec((parsed['package.json'] && parsed['package.json'].engines || {}).node || '');
const matrix = /node:\s*\[([^\]]+)\]/.exec(read('.github/workflows/validate.yml'));
if (!engine) fail('package.json: engines.node missing');
else if (!matrix) fail('.github/workflows/validate.yml: no node matrix — engines.node is untested');
else {
  const lowest = Math.min(...matrix[1].split(',').map(Number));
  if (lowest !== Number(engine[1])) {
    fail(`CI tests Node ${lowest}+ but package.json claims >=${engine[1]} — test what you claim`);
  }
}

// ---- 6c. Context-cost estimates in the docs --------------------------------
// Every installed pack keeps its skill names + descriptions in context on every
// turn. Docs quote that cost per pack; recompute it (chars/4, rounded to 0.1k)
// so the figures cannot drift as skills are added.
const descTokens = {};
for (const p of skillFiles) {
  const fm = fs.readFileSync(p, 'utf8').match(/^description:\s*(.*)$/m);
  const parts = path.relative(skillsRoot, p).split(path.sep);
  const pack = parts.length > 2 ? parts[0] : 'core';
  descTokens[pack] = (descTokens[pack] || 0) + ((fm ? fm[1] : '') + parts[parts.length - 2]).length / 4;
}
const k = (n) => Math.round(n / 100) / 10;
const totalK = k(Object.values(descTokens).reduce((a, b) => a + b, 0));
for (const rel of ['USAGE.md', 'plugins/README.md']) {
  const text = read(rel);
  const line = text.split('\n').find((l) => /installed pack keeps/.test(l));
  if (!line) { fail(`${rel}: per-pack context cost no longer stated — update the check or restore it`); continue; }
  const quoted = [...line.split('All eight')[0].matchAll(/\b([a-z]+) ~(\d+\.\d)k/g)];
  if (quoted.length !== Object.keys(descTokens).length) {
    fail(`${rel}: quotes context cost for ${quoted.length} packs, there are ${Object.keys(descTokens).length}`);
  }
  for (const [, pack, n] of quoted) {
    if (!(pack in descTokens)) fail(`${rel}: context cost for unknown pack "${pack}"`);
    else if (Math.abs(Number(n) - k(descTokens[pack])) > 0.15) {
      fail(`${rel}: claims ${pack} ~${n}k tokens, measured ~${k(descTokens[pack])}k`);
    }
  }
  const total = /All eight[^0-9]*(\d+\.\d)k/.exec(line);
  if (!total) fail(`${rel}: all-packs context cost no longer stated`);
  else if (Math.abs(Number(total[1]) - totalK) > 0.3) {
    fail(`${rel}: claims all packs ~${total[1]}k tokens, measured ~${totalK}k`);
  }
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

// ---- 7b. Links in the public docs resolve ---------------------------------
// README, guides, plugins, examples, and evals link with plain relative paths
// ("(.ai/README.md)"), so every non-URL Markdown link is checked here.
const publicDocs = [
  ...fs.readdirSync(ROOT).filter((f) => f.endsWith('.md')).map((f) => path.join(ROOT, f)),
  path.join(ROOT, 'plugins/README.md'),
  ...['examples', 'evals'].flatMap((d) =>
    fs.existsSync(path.join(ROOT, d)) ? [...walk(path.join(ROOT, d))].filter((p) => p.endsWith('.md')) : []),
];
const LINK = /\]\(((?!https?:|mailto:|#)[^)\s]+)\)/g;
for (const p of publicDocs) {
  for (const m of fs.readFileSync(p, 'utf8').matchAll(LINK)) {
    const link = m[1].split('#')[0];
    if (!link || /[<>*|]/.test(link)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(p), link))) {
      fail(`${path.relative(ROOT, p)}: link does not resolve — ${link}`);
    }
  }
}

// ---- 8. Intent index ------------------------------------------------------
// Every entry is a link to a SKILL.md (resolution is checked in 7). Here: the
// index still links skills at all, and covers every pack.
const intent = read('.ai/skills/SKILLS_INDEX.md');
const linked = [...intent.matchAll(/\]\(([a-z0-9/-]+)\/SKILL\.md\)/g)].map((m) => m[1]);
if (linked.length < 20) fail(`.ai/skills/SKILLS_INDEX.md: only ${linked.length} skill links — index emptied?`);
for (const pack of Object.keys(packs)) {
  const inPack = pack === 'core' ? linked.some((l) => !l.includes('/')) : linked.some((l) => l.startsWith(pack + '/'));
  if (!inPack) fail(`.ai/skills/SKILLS_INDEX.md: no entry for the ${pack} pack`);
}

// ---- 9. Version quoted in the root README ----------------------------------
const readmeVersion = read('README.md').match(/Version \*\*(\d+\.\d+\.\d+)\*\*/);
if (!readmeVersion) fail('README.md: no longer quotes the version');
else if (readmeVersion[1] !== version) fail(`README.md: quotes version ${readmeVersion[1]}, .ai/VERSION is ${version}`);

// ---- 10. Examples and evaluations keep their honesty labels ----------------
// An example artifact without a status line reads as if it were real output;
// an eval case without its properties cannot be scored.
const exRoot = path.join(ROOT, 'examples');
const examples = fs.readdirSync(exRoot).filter((d) => fs.statSync(path.join(exRoot, d)).isDirectory());
if (!examples.length) fail('examples/: no examples');
for (const ex of examples) {
  for (const f of fs.readdirSync(path.join(exRoot, ex)).filter((x) => x.endsWith('.md'))) {
    const head = fs.readFileSync(path.join(exRoot, ex, f), 'utf8').split('\n').slice(0, 4).join('\n');
    if (!/\*\*Status: (PROPOSED|APPROVED \(simulated\)|GENERATED|VERIFIED|IMPLEMENTED)[.*\s]/.test(head)) {
      fail(`examples/${ex}/${f}: missing a status label (PROPOSED, GENERATED, VERIFIED, …) in its first lines`);
    }
  }
}
const evRoot = path.join(ROOT, 'evals');
const evalReadme = read('evals/README.md');
const cases = fs.readdirSync(evRoot).filter((d) => d !== 'results' && fs.statSync(path.join(evRoot, d)).isDirectory());
if (cases.length < 1) fail('evals/: no cases');
for (const c of cases) {
  for (const f of ['input.md', 'expected-properties.md', 'evaluation.md']) {
    if (!fs.existsSync(path.join(evRoot, c, f))) fail(`evals/${c}/: missing ${f}`);
  }
  if (!evalReadme.includes(`(${c}/)`)) fail(`evals/README.md: case "${c}" is not listed`);
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
