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
`);
}

function parseArgs(argv) {
  const opts = { dir: null, editors: null, force: false, dryRun: false, help: false, version: false, cmd: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '-v' || a === '--version') opts.version = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--editor' || a.startsWith('--editor=')) {
      const v = a === '--editor' ? argv[++i] : a.slice('--editor='.length);
      if (!v || v.startsWith('-')) { fail('Missing value for --editor'); process.exit(1); }
      opts.editors = v.toLowerCase();
    }
    else if (a === 'init') opts.cmd = 'init';
    else if (!a.startsWith('-') && opts.cmd === null) opts.cmd = a; // tolerate bare command
    else if (!a.startsWith('-')) opts.dir = a;
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

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.version) {
    log(require(path.join(PKG_ROOT, 'package.json')).version);
    process.exit(0);
  }
  if (opts.help || opts.cmd === null) {
    printHelp();
    process.exit(opts.help ? 0 : 1);
  }
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

try {
  main();
} catch (err) {
  fail('Install failed: ' + (err && err.message ? err.message : String(err)));
  process.exit(1);
}
