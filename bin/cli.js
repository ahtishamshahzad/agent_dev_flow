#!/usr/bin/env node
'use strict';

/**
 * AI Engineering System — installer.
 *
 * Copies the canonical `.ai/` directory, the `AGENTS.md` entry point, the
 * usage guides, and the chosen editor adapter(s) into a target project. File-based only: it installs
 * no dependencies, selects no stack, and creates no repository.
 *
 * Usage:
 *   npx github:ahtishamshahzad/agent_dev_flow init [dir] [options]
 *
 * Options:
 *   --editor <list>   Comma-separated: claude, cursor, windsurf, copilot, codex, all
 *                     (default: all). "codex" is covered by AGENTS.md, always copied.
 *   --force           Overwrite system files that already exist. Project-owned
 *                     folders (.ai/projects, work-items, references, knowledge,
 *                     memory) are never overwritten — only missing files are added.
 *   --dry-run         Print what would be copied; write nothing.
 *   -v, --version     Show version.
 *   -h, --help        Show help.
 */

const fs = require('fs');
const path = require('path');

// A downstream pipe closing early (e.g. `… | head`) must exit quietly, not crash.
process.stdout.on('error', (err) => { if (err.code === 'EPIPE') process.exit(0); });

// Package root = one level up from bin/. Everything shipped lives here.
const PKG_ROOT = path.resolve(__dirname, '..');

// Adapter file/dir sets, relative to PKG_ROOT. AGENTS.md + .ai are always copied.
const ADAPTERS = {
  claude: ['CLAUDE.md'],
  cursor: ['.cursor/rules/project.mdc'],
  windsurf: ['.windsurf/rules/project.md'],
  copilot: ['.github/copilot-instructions.md'],
  codex: [], // AGENTS.md is its native entry point; nothing extra
};

const ALWAYS = ['.ai', 'AGENTS.md', 'USAGE.md', 'QUICK_START.md'];

// Project-owned: the adopting project writes its own state here. --force updates
// the system around them but never overwrites a file inside; missing files are
// still added. (USAGE.md: "Put project-specific content in …")
const PROTECTED = [
  '.ai/projects',
  '.ai/work-items',
  '.ai/references',
  '.ai/knowledge',
  '.ai/memory',
];

function isProtected(rel) {
  const p = rel.split(path.sep).join('/');
  return PROTECTED.some((dir) => p === dir || p.startsWith(dir + '/'));
}

const COLORS = process.stdout.isTTY
  ? { dim: '\x1b[2m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', bold: '\x1b[1m', reset: '\x1b[0m' }
  : { dim: '', green: '', yellow: '', red: '', bold: '', reset: '' };

function log(msg) { process.stdout.write(msg + '\n'); }
function fail(msg) { process.stderr.write(c('red', msg) + '\n'); }
function c(color, msg) { return COLORS[color] + msg + COLORS.reset; }

function printHelp() {
  log(`
${c('bold', 'AI Engineering System — installer')}

  ${c('bold', 'npx github:ahtishamshahzad/agent_dev_flow init')} ${c('dim', '[dir] [options]')}

Copies the canonical ${c('bold', '.ai/')} directory, ${c('bold', 'AGENTS.md')}, the usage guides,
and your editor adapter(s) into a project. No dependencies, no stack, no repo — files only.

${c('bold', 'Arguments')}
  dir                 Target project directory (default: current directory)

${c('bold', 'Options')}
  --editor <list>     Comma-separated editors to set up. Default: ${c('bold', 'all')}
                      Values: claude, cursor, windsurf, copilot, codex, all
  --force             Overwrite existing system files (project data in
                      .ai/projects, work-items, references, knowledge,
                      memory is never overwritten)
  --dry-run           Show what would be copied without writing
  -v, --version       Show version
  -h, --help          Show this help

${c('bold', 'Examples')}
  npx github:ahtishamshahzad/agent_dev_flow init
  npx github:ahtishamshahzad/agent_dev_flow init ./my-app --editor claude,cursor
  npx github:ahtishamshahzad/agent_dev_flow init --editor claude --force

${c('bold', 'Gherkin')}
  npx github:ahtishamshahzad/agent_dev_flow gherkin validate ${c('dim', '[path ...]')}
                      Check .feature files against the behavior contract
                      (.ai/system/GHERKIN_RULES.md). Default path: features/
                      Exits 1 on any error; warnings do not fail.
  npx github:ahtishamshahzad/agent_dev_flow gherkin trace ${c('dim', '[features ...] --tests <dir>')}
                      List scenarios no test names (test names contain the
                      scenario title). Exits 1 if an @critical one has no test.

${c('bold', 'Technology drift')}
  npx github:ahtishamshahzad/agent_dev_flow drift ${c('dim', '[dir] [--prod] [--json] [--fail-on security|eol|any]')}
                      Installed vs latest stable, advisories, deprecations, Node
                      end of life. "Available" is information; "recommended"
                      needs a trigger (.ai/system/TECHNOLOGY_GOVERNANCE_RULES.md).
`);
}

function parseArgs(argv) {
  const opts = { dir: null, editors: null, force: false, dryRun: false, help: false, version: false, cmd: null, args: [],
    json: false, prod: false, failOn: null, tests: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '-v' || a === '--version') opts.version = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--prod') opts.prod = true;
    else if (a === '--fail-on' || a === '--tests') {
      const v = argv[++i];
      if (!v || v.startsWith('-')) { fail(`Missing value for ${a}`); process.exit(1); }
      if (a === '--fail-on') {
        if (!['security', 'eol', 'any'].includes(v)) { fail(`--fail-on must be security, eol, or any`); process.exit(1); }
        opts.failOn = v;
      } else opts.tests = v;
    }
    else if (a === '--editor' || a.startsWith('--editor=')) {
      const v = a === '--editor' ? argv[++i] : a.slice('--editor='.length);
      if (!v || v.startsWith('-')) { fail('Missing value for --editor'); process.exit(1); }
      opts.editors = v.toLowerCase();
    }
    else if (!a.startsWith('-') && opts.cmd === null) opts.cmd = a;
    else if (!a.startsWith('-')) { opts.dir = a; opts.args.push(a); }
    else { fail(`Unknown option: ${a}`); process.exit(1); }
  }
  return opts;
}

function resolveEditors(editorsArg) {
  const all = ['claude', 'cursor', 'windsurf', 'copilot', 'codex'];
  if (!editorsArg || editorsArg === 'all') return all;
  const requested = editorsArg.split(',').map((s) => s.trim()).filter(Boolean);
  const invalid = requested.filter((e) => !all.includes(e) && e !== 'all');
  if (invalid.length) {
    fail(`Unknown editor(s): ${invalid.join(', ')}`);
    process.stderr.write(`Valid: ${all.join(', ')}, all\n`);
    process.exit(1);
  }
  if (requested.includes('all')) return all;
  return requested;
}

function copyRecursive(src, dest, opts, results) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!opts.dryRun) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child), opts, results);
    }
    return;
  }
  const exists = fs.existsSync(dest);
  if (exists && opts.force && isProtected(path.relative(PKG_ROOT, src))) {
    results.kept.push(dest);
    return;
  }
  if (exists && !opts.force) {
    results.skipped.push(dest);
    return;
  }
  if (!opts.dryRun) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
  results[exists ? 'overwritten' : 'copied'].push(dest);
}

let opts0 = null;

function main() {
  const opts = parseArgs(process.argv.slice(2));
  opts0 = opts;

  if (opts.version) {
    log(require(path.join(PKG_ROOT, 'package.json')).version);
    process.exit(0);
  }
  if (opts.help || opts.cmd === null) {
    printHelp();
    process.exit(opts.help ? 0 : 1);
  }
  if (opts.cmd === 'gherkin') return gherkin(opts.args, opts);
  if (opts.cmd === 'drift') return drift(opts);
  if (opts.cmd !== 'init') {
    fail(`Unknown command: ${opts.cmd}`);
    printHelp();
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), opts.dir || '.');
  const editors = resolveEditors(opts.editors);

  // Build the source list: always-copied + adapter files for chosen editors.
  const sources = new Set(ALWAYS);
  for (const e of editors) for (const f of ADAPTERS[e]) sources.add(f);

  // Verify every source exists in the package before touching the target.
  const missing = [];
  for (const rel of sources) {
    if (!fs.existsSync(path.join(PKG_ROOT, rel))) missing.push(rel);
  }
  if (missing.length) {
    fail('Installer is missing bundled files: ' + missing.join(', '));
    process.stderr.write('This is a packaging error — please report it.\n');
    process.exit(1);
  }

  log('');
  log(c('bold', 'AI Engineering System'));
  log(c('dim', `  target : ${targetDir}`));
  log(c('dim', `  editors: ${editors.join(', ')}`));
  if (opts.dryRun) log(c('yellow', '  dry run: no files will be written'));
  log('');

  const results = { copied: [], overwritten: [], skipped: [], kept: [] };
  for (const rel of sources) {
    copyRecursive(path.join(PKG_ROOT, rel), path.join(targetDir, rel), opts, results);
  }

  const rel = (p) => path.relative(targetDir, p) || '.';
  if (results.copied.length) log(c('green', `  copied      ${results.copied.length} file(s)`));
  if (results.overwritten.length) log(c('yellow', `  overwritten ${results.overwritten.length} file(s)`));
  if (results.kept.length) {
    log(c('dim', `  kept        ${results.kept.length} project file(s) — project data is never overwritten`));
  }
  if (results.skipped.length) {
    log(c('dim', `  skipped     ${results.skipped.length} existing file(s) — use --force to overwrite`));
    for (const p of results.skipped.slice(0, 8)) log(c('dim', `    · ${rel(p)}`));
    if (results.skipped.length > 8) log(c('dim', `    · … and ${results.skipped.length - 8} more`));
  }

  log('');
  if (opts.dryRun) {
    log(c('yellow', 'Dry run complete. Re-run without --dry-run to install.'));
  } else if (!results.copied.length && !results.overwritten.length) {
    log(c('yellow', 'Nothing installed — all files already existed. Use --force to overwrite.'));
  } else {
    log(c('green', c('bold', 'Done.')));
  }

  log('');
  log(c('bold', 'Next steps'));
  log('  1. Read USAGE.md (what to type, per editor), then .ai/README.md');
  if (editors.includes('claude')) {
    log('  2. Claude Code: optionally install native skill plugins:');
    log(c('dim', '       /plugin marketplace add ahtishamshahzad/agent_dev_flow'));
    log(c('dim', '       /plugin install ai-core@agent_dev_flow'));
  }
  log('  3. Keep .ai/ canonical; put project state in .ai/projects/current/');
  log('');
}

// `gherkin validate [path ...]` — lint .feature files against the contract.
function gherkin(args, opts = {}) {
  const [sub, ...paths] = args;
  if (sub === 'trace') return gherkinTrace(paths, opts);
  if (sub !== 'validate') {
    fail(sub ? `Unknown gherkin command: ${sub}` : 'Missing gherkin command — use: gherkin validate|trace [path ...]');
    process.exit(1);
  }
  const { lint } = require(path.join(PKG_ROOT, 'lib', 'gherkin-lint.js'));
  const SKIP = new Set(['node_modules', '.git', 'dist', 'build', 'coverage']);
  const roots = paths.length ? paths : ['features'];
  const files = [];
  const collect = (p) => {
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      for (const child of fs.readdirSync(p)) if (!SKIP.has(child)) collect(path.join(p, child));
    } else if (p.endsWith('.feature')) files.push(p);
  };
  for (const r of roots) {
    const abs = path.resolve(process.cwd(), r);
    if (!fs.existsSync(abs)) { fail(`Path not found: ${r}`); process.exit(1); }
    collect(abs);
  }
  if (!files.length) {
    fail(`No .feature files found in ${roots.join(', ')}`);
    process.exit(1);
  }

  let errors = 0;
  let warnings = 0;
  for (const f of files.sort()) {
    const rel = path.relative(process.cwd(), f) || f;
    for (const p of lint(fs.readFileSync(f, 'utf8'), f)) {
      if (p.level === 'error') errors++; else warnings++;
      log(`${rel}:${p.line}  ${p.level === 'error' ? c('red', 'error  ') : c('yellow', 'warning')}  ${p.message}`);
    }
  }
  const summary = `${files.length} feature file(s), ${errors} error(s), ${warnings} warning(s)`;
  if (errors) { fail(summary); process.exit(1); }
  log(c('green', summary));
}

// `gherkin trace [features ...] --tests <dir>` — every scenario named by a test.
function gherkinTrace(paths, opts) {
  const { trace } = require(path.join(PKG_ROOT, 'lib', 'gherkin-trace.js'));
  const roots = (paths.length ? paths : ['features']).map((p) => path.resolve(process.cwd(), p));
  const testRoots = (opts.tests || '.').split(',').map((p) => path.resolve(process.cwd(), p));
  for (const r of [...roots, ...testRoots]) {
    if (!fs.existsSync(r)) { fail(`Path not found: ${path.relative(process.cwd(), r) || r}`); process.exit(1); }
  }
  const r = trace(roots, testRoots);
  if (!r.scenarios.length) { fail('No scenarios found'); process.exit(1); }
  const rel = (p) => path.relative(process.cwd(), p) || p;
  const missing = r.scenarios.filter((s) => !s.tests.length);
  const critical = missing.filter((s) => s.tags.includes('@critical'));
  if (opts.json) log(JSON.stringify({ ...r, scenarios: r.scenarios.map((s) => ({ ...s, file: rel(s.file), tests: s.tests.map(rel) })) }, null, 2));
  else {
    for (const s of missing) {
      log(`${rel(s.file)}:${s.line}  ${s.tags.includes('@critical') ? c('red', 'no test (critical)') : c('yellow', 'no test         ')}  ${s.title}`);
    }
    const summary = `${r.scenarios.length} scenario(s), ${r.scenarios.length - missing.length} with a test, ${missing.length} without (${critical.length} @critical) · ${r.tests.length} test file(s) searched`;
    if (critical.length) fail(summary); else log(missing.length ? c('yellow', summary) : c('green', summary));
  }
  if (critical.length) process.exit(1);
}

// `drift [dir]` — installed vs latest stable, with triggers (TECHNOLOGY_GOVERNANCE_RULES.md).
async function drift(opts) {
  const { report } = require(path.join(PKG_ROOT, 'lib', 'drift.js'));
  const dir = path.resolve(process.cwd(), opts.args[0] || '.');
  const r = await report(dir, { prod: opts.prod });
  if (opts.json) {
    log(JSON.stringify(r, null, 2));
  } else {
    const cell = (s, n) => String(s == null ? '—' : s).padEnd(n);
    log(c('bold', `${cell('package', 28)} ${cell('installed', 12)} ${cell('latest stable', 14)} ${cell('available', 10)} recommended`));
    for (const row of r.rows) {
      const rec = row.recommended
        ? c('red', `YES — ${row.triggers.map((t) => `${t.kind}${t.severity ? ` (${t.severity})` : ''}`).join(', ')}`)
        : c('dim', row.available ? 'no — newer alone is not a reason' : 'no');
      log(`${cell(row.name, 28)} ${cell(row.version || `${row.declared} (range)`, 12)} ${cell(row.latest, 14)} ${cell(row.available ? 'yes' : 'no', 10)} ${rec}`);
      for (const t of row.triggers) log(c('dim', `    ${t.kind}: ${t.detail} · urgency ${t.urgency}`));
      if (row.fixedIn) {
        log(c('dim', `    smallest safe version: ${row.fixedIn}${row.fixSameMajor ? ' (same major — no major upgrade needed)' : ' (needs a major upgrade — plan a migration)'}`));
      } else if (row.triggers.some((t) => t.kind === 'security') && row.version) {
        log(c('yellow', '    no released version clears every advisory — mitigate or replace'));
      }
    }
    if (r.runtime) {
      const rt = r.runtime;
      const rec = rt.recommended ? c('red', `YES — end of life (${rt.end})`) : c('dim', rt.end ? `no — supported until ${rt.end}` : 'no');
      log(`${cell(`node ${rt.major} (${rt.source})`, 56)} ${cell('', 11)} ${rec}`);
    }
    if (r.rows.some((x) => x.source === 'range only')) log(c('yellow', 'Some versions are ranges only — no package-lock.json or node_modules; installed versions unknown.'));
    for (const e of r.errors) process.stderr.write(`warning: ${e}\n`);
  }
  const sec = r.rows.some((x) => x.triggers.some((t) => t.kind === 'security'));
  const eol = !!(r.runtime && r.runtime.recommended);
  const any = sec || eol || r.rows.some((x) => x.recommended);
  if ((opts.failOn === 'security' && sec) || (opts.failOn === 'eol' && eol) || (opts.failOn === 'any' && any)) process.exit(1);
  if (r.errors.length && !r.rows.some((x) => x.latest)) process.exit(1); // nothing could be checked
}

Promise.resolve()
  .then(main)
  .catch((err) => {
    fail((opts0 && opts0.cmd === 'drift' ? 'Drift check failed: ' : 'Install failed: ') + (err && err.message ? err.message : String(err)));
    process.exit(1);
  });
