'use strict';

// The installer must work from the published artifact, not only from a git
// checkout: pack the package, unpack the tarball, run its CLI.

const { test, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const VERSION = require(path.join(ROOT, 'package.json')).version;
const NPM = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-pack-'));
after(() => fs.rmSync(scratch, { recursive: true, force: true }));

function sh(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8' });
  assert.strictEqual(r.status, 0, `${cmd} ${args.join(' ')}\n${r.stderr}`);
  return r.stdout;
}

test('the packed tarball installs a working system', () => {
  const out = sh(NPM, ['pack', '--json', '--pack-destination', scratch], ROOT);
  const [info] = JSON.parse(out);
  const tarball = path.join(scratch, info.filename);

  const unpacked = path.join(scratch, 'unpacked');
  fs.mkdirSync(unpacked);
  sh('tar', ['-xzf', tarball, '-C', unpacked]);
  const cli = path.join(unpacked, 'package', 'bin', 'cli.js');

  assert.ok(fs.statSync(cli).mode & 0o111, 'bin/cli.js is executable in the package');
  assert.strictEqual(sh(process.execPath, [cli, '--version']).trim(), VERSION);

  const project = path.join(scratch, 'project');
  sh(process.execPath, [cli, 'init', project, '--editor', 'all']);
  for (const rel of [
    '.ai/VERSION', '.ai/system/OPERATING_RULES.md', '.ai/skills/project-orchestrator/SKILL.md',
    'AGENTS.md', 'CLAUDE.md', 'USAGE.md', 'QUICK_START.md',
    '.cursor/rules/project.mdc', '.windsurf/rules/project.md', '.github/copilot-instructions.md',
  ]) assert.ok(fs.existsSync(path.join(project, rel)), `missing ${rel} after install from tarball`);

  const files = info.files.map((f) => f.path);
  assert.ok(!files.some((f) => f.startsWith('test/')), 'tests are not shipped');
  assert.ok(!files.some((f) => f.startsWith('plugins/')), 'plugins are distributed by the marketplace, not npm');
});
