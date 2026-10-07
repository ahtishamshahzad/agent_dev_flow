'use strict';

// Installer behavior, end to end: every test spawns the real CLI against a
// throwaway directory under the OS temp dir. Nothing touches the repository.

const { test, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CLI = path.join(ROOT, 'bin', 'cli.js');
const VERSION = require(path.join(ROOT, 'package.json')).version;

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-cli-'));
after(() => fs.rmSync(scratch, { recursive: true, force: true }));

let n = 0;
const tmp = (name = 'proj') => path.join(scratch, `${++n}-${name}`);

function run(args, opts = {}) {
  const r = spawnSync(process.execPath, [opts.cli || CLI, ...args], {
    cwd: opts.cwd || scratch,
    encoding: 'utf8',
  });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

const exists = (dir, rel) => fs.existsSync(path.join(dir, rel));

test('--version prints the package version and exits 0', () => {
  for (const flag of ['--version', '-v']) {
    const r = run([flag]);
    assert.strictEqual(r.code, 0);
    assert.strictEqual(r.out.trim(), VERSION);
  }
});

test('--help exits 0; no command prints help and exits 1', () => {
  assert.strictEqual(run(['--help']).code, 0);
  assert.match(run(['-h']).out, /--editor <list>/);
  const bare = run([]);
  assert.strictEqual(bare.code, 1);
  assert.match(bare.out, /--editor <list>/);
});

test('init with all editors installs .ai/, AGENTS.md, guides, and every adapter', () => {
  const dir = tmp();
  const r = run(['init', dir]);
  assert.strictEqual(r.code, 0, r.err);
  for (const rel of [
    '.ai/VERSION', '.ai/skills/README.md', 'AGENTS.md', 'USAGE.md', 'QUICK_START.md',
    'CLAUDE.md', '.cursor/rules/project.mdc', '.windsurf/rules/project.md',
    '.github/copilot-instructions.md',
  ]) assert.ok(exists(dir, rel), `missing ${rel}`);
  assert.strictEqual(fs.readFileSync(path.join(dir, '.ai/VERSION'), 'utf8').trim(), VERSION);
});

test('init defaults to the current directory', () => {
  const dir = tmp();
  fs.mkdirSync(dir);
  assert.strictEqual(run(['init', '--editor', 'claude'], { cwd: dir }).code, 0);
  assert.ok(exists(dir, 'CLAUDE.md'));
});

const ADAPTER = {
  claude: 'CLAUDE.md',
  cursor: '.cursor/rules/project.mdc',
  windsurf: '.windsurf/rules/project.md',
  copilot: '.github/copilot-instructions.md',
};

for (const editor of ['claude', 'cursor', 'windsurf', 'copilot', 'codex']) {
  test(`--editor ${editor} installs only its adapter`, () => {
    const dir = tmp(editor);
    assert.strictEqual(run(['init', dir, '--editor', editor]).code, 0);
    assert.ok(exists(dir, 'AGENTS.md'), 'AGENTS.md is always installed');
    for (const [name, rel] of Object.entries(ADAPTER)) {
      assert.strictEqual(exists(dir, rel), name === editor, `${rel} for --editor ${editor}`);
    }
  });
}

test('--editor accepts a list and the = form', () => {
  const dir = tmp();
  assert.strictEqual(run(['init', dir, '--editor=claude,cursor']).code, 0);
  assert.ok(exists(dir, 'CLAUDE.md') && exists(dir, '.cursor/rules/project.mdc'));
  assert.ok(!exists(dir, '.windsurf/rules/project.md'));
});

test('an unknown editor fails on stderr with exit 1 and writes nothing', () => {
  const dir = tmp();
  const r = run(['init', dir, '--editor', 'claude,vim']);
  assert.strictEqual(r.code, 1);
  assert.match(r.err, /Unknown editor\(s\): vim/);
  assert.ok(!fs.existsSync(dir));
});

test('a missing --editor value, unknown option, or unknown command exits 1 on stderr', () => {
  for (const [args, msg] of [
    [['init', '--editor'], /Missing value for --editor/],
    [['init', '--editor', '--force'], /Missing value for --editor/],
    [['init', '--bogus'], /Unknown option: --bogus/],
    [['install'], /Unknown command: install/],
  ]) {
    const r = run(args);
    assert.strictEqual(r.code, 1, args.join(' '));
    assert.match(r.err, msg);
  }
});

test('--dry-run writes nothing', () => {
  const dir = tmp();
  const r = run(['init', dir, '--dry-run']);
  assert.strictEqual(r.code, 0);
  assert.match(r.out, /Dry run complete/);
  assert.ok(!fs.existsSync(dir));
});

test('existing files are skipped without --force', () => {
  const dir = tmp();
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'CLAUDE.md'), 'mine');
  const r = run(['init', dir, '--editor', 'claude']);
  assert.strictEqual(r.code, 0);
  assert.match(r.out, /skipped\s+1 existing file/);
  assert.strictEqual(fs.readFileSync(path.join(dir, 'CLAUDE.md'), 'utf8'), 'mine');
});

test('a second init with everything present installs nothing', () => {
  const dir = tmp();
  run(['init', dir, '--editor', 'claude']);
  const r = run(['init', dir, '--editor', 'claude']);
  assert.strictEqual(r.code, 0);
  assert.match(r.out, /Nothing installed/);
});

test('--force overwrites system files but never project data', () => {
  const dir = tmp();
  run(['init', dir, '--editor', 'claude']);
  const system = path.join(dir, 'CLAUDE.md');
  const state = path.join(dir, '.ai/projects/current/README.md');
  const bugs = path.join(dir, '.ai/work-items/bugs/README.md');
  fs.writeFileSync(system, 'edited');
  fs.writeFileSync(state, 'my project state');
  fs.writeFileSync(bugs, 'my bug index');
  fs.rmSync(path.join(dir, '.ai/references/README.md'));

  const r = run(['init', dir, '--editor', 'claude', '--force']);
  assert.strictEqual(r.code, 0, r.err);
  assert.notStrictEqual(fs.readFileSync(system, 'utf8'), 'edited', 'system file restored');
  assert.strictEqual(fs.readFileSync(state, 'utf8'), 'my project state');
  assert.strictEqual(fs.readFileSync(bugs, 'utf8'), 'my bug index');
  assert.ok(exists(dir, '.ai/references/README.md'), 'missing project-folder files are still added');
  assert.match(r.out, /kept\s+\d+ project file/);
});

test('nested and space-containing target paths are created', () => {
  const dir = path.join(tmp('with space'), 'a b', 'c');
  const r = run(['init', dir, '--editor', 'codex']);
  assert.strictEqual(r.code, 0, r.err);
  assert.ok(exists(dir, 'AGENTS.md') && exists(dir, '.ai/VERSION'));
});

test('a target path that is a file fails with exit 1', () => {
  const file = tmp('file');
  fs.writeFileSync(file, 'x');
  const r = run(['init', file, '--editor', 'codex']);
  assert.strictEqual(r.code, 1);
  assert.match(r.err, /Install failed/);
});

test('a missing bundled file is a packaging error, before anything is written', () => {
  // A minimal copy of the package without CLAUDE.md.
  const pkg = tmp('pkg');
  fs.mkdirSync(path.join(pkg, 'bin'), { recursive: true });
  fs.copyFileSync(CLI, path.join(pkg, 'bin', 'cli.js'));
  fs.copyFileSync(path.join(ROOT, 'package.json'), path.join(pkg, 'package.json'));
  for (const f of ['AGENTS.md', 'USAGE.md', 'QUICK_START.md']) fs.writeFileSync(path.join(pkg, f), f);
  fs.mkdirSync(path.join(pkg, '.ai'));
  fs.writeFileSync(path.join(pkg, '.ai', 'VERSION'), VERSION);

  const dir = tmp();
  const r = run(['init', dir, '--editor', 'claude'], { cli: path.join(pkg, 'bin', 'cli.js') });
  assert.strictEqual(r.code, 1);
  assert.match(r.err, /missing bundled files: CLAUDE\.md/);
  assert.ok(!fs.existsSync(dir));
});

test('piping into a reader that closes early prints no error', { skip: process.platform === 'win32' }, () => {
  // `head -c 1` closes its end after one byte; the CLI keeps writing.
  const cmd = `"${process.execPath}" "${CLI}" init "${tmp()}" --dry-run | head -c 1 >/dev/null`;
  const r = spawnSync('sh', ['-c', cmd], { encoding: 'utf8' });
  assert.strictEqual(r.status, 0);
  assert.doesNotMatch(r.stderr, /EPIPE|Error/);
});
