'use strict';

// `agentflow context check` (stale stable summaries) and `context suggest`
// (a starting context set, each item with its reason). Temp projects only.

const { test, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { globToRe, terms } = require('../lib/context');

const CLI = path.resolve(__dirname, '..', 'bin', 'cli.js');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-context-'));
after(() => fs.rmSync(scratch, { recursive: true, force: true }));

const run = (args, cwd = scratch) => {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { code: r.status, out: r.stdout, err: r.stderr };
};
const write = (root, rel, text) => {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), text);
};

test('globs and terms behave predictably', () => {
  assert.ok(globToRe('prisma/*.prisma').test('prisma/schema.prisma'));
  assert.ok(globToRe('src/**/*.ts').test('src/a/b/c.ts'));
  assert.ok(globToRe('src/**/*.ts').test('src/c.ts'));
  assert.ok(!globToRe('src/*.ts').test('src/a/c.ts'));
  assert.deepStrictEqual(terms('the a of'), []);
  assert.ok(terms('failing notifications').includes('notification'));
});

test('context check: unfingerprinted → --update → fresh → source change → stale', () => {
  const root = path.join(scratch, 'check');
  write(root, 'package.json', '{"dependencies":{"express":"^4.19.2"}}');
  write(root, 'prisma/schema.prisma', 'model User { id Int @id }');
  write(root, '.ai/projects/current/context/technology.md',
    '---\ntitle: Technology summary\nsources:\n  - package.json\n  - prisma/*.prisma\nfingerprint: <written by tool>\nupdated: 2026-01-01\n---\n\n# Technology\n\n- Express 4\n');

  let r = run(['context', 'check', root]);
  assert.strictEqual(r.code, 0);
  assert.match(r.out, /unfingerprinted\s+technology\.md\s+\(2 source file/);

  r = run(['context', 'check', root, '--update']);
  assert.match(r.out, /updated\s+technology\.md/);
  const text = fs.readFileSync(path.join(root, '.ai/projects/current/context/technology.md'), 'utf8');
  assert.match(text, /^fingerprint: [0-9a-f]{16}$/m);
  assert.match(text, /- Express 4/, 'body is preserved');

  assert.match(run(['context', 'check', root]).out, /fresh\s+technology\.md/);

  write(root, 'prisma/schema.prisma', 'model User { id Int @id\n  email String }');
  r = run(['context', 'check', root]);
  assert.strictEqual(r.code, 1, 'a stale summary fails the check');
  assert.match(r.out, /stale\s+technology\.md/);
  assert.match(r.err, /re-read the sources/);
});

test('context check: no summaries is not an error; missing sources are reported', () => {
  const empty = path.join(scratch, 'empty');
  fs.mkdirSync(empty);
  assert.strictEqual(run(['context', 'check', empty]).code, 0);

  const root = path.join(scratch, 'missing');
  write(root, '.ai/projects/current/context/project.md', '---\nsources:\n  - docs/ARCHITECTURE.md\n---\n# x\n');
  assert.match(run(['context', 'check', root]).out, /missing: docs\/ARCHITECTURE\.md/);
});

test('context suggest: scenarios first, then skills, files, tests, dependencies — each with a reason', () => {
  const root = path.join(scratch, 'suggest');
  write(root, 'features/notifications/order-status.feature',
    'Feature: Order status notifications\n\n  Scenario: Customer gets one notification per status change\n    Given a\n    When b\n    Then c\n');
  write(root, 'features/billing/upgrade.feature', 'Feature: Upgrade plan\n\n  Scenario: Admin upgrades the plan\n    Given a\n    When b\n    Then c\n');
  write(root, 'src/notifications/notify.js', "const mailer = require('../mailer');\nmodule.exports = () => mailer.send();\n");
  write(root, 'src/mailer.js', 'module.exports = { send() {} };\n');
  write(root, 'src/billing/stripe.js', 'module.exports = {};\n');
  write(root, 'test/notify.test.js', "test('one notification per status change', () => {});\n");
  write(root, '.ai/skills/SKILLS_INDEX.md',
    '| I want to… | Start with |\n|---|---|\n| Send email or push notifications | [`email-notifications`](backend/email-notifications/SKILL.md) |\n| Add payments | [`payments-subscriptions`](backend/payments-subscriptions/SKILL.md) |\n');

  const r = run(['context', 'suggest', 'duplicate notifications on status change', '--dir', root, '--json']);
  assert.strictEqual(r.code, 0, r.err);
  const j = JSON.parse(r.out);
  assert.match(j.scenarios[0].path, /order-status\.feature:3/);
  assert.ok(!j.scenarios.some((s) => /upgrade/.test(s.path)), 'unrelated scenarios excluded');
  assert.deepStrictEqual(j.skills.map((s) => s.name), ['email-notifications']);
  assert.strictEqual(j.files[0].path, 'src/notifications/notify.js');
  assert.ok(!j.files.some((f) => /stripe/.test(f.path)), 'unrelated files excluded');
  assert.ok(j.tests.some((t) => t.path === 'test/notify.test.js'));
  assert.ok(j.dependencies.some((d) => d.path === 'src/mailer.js' && /imported by/.test(d.why)));
  for (const item of [...j.scenarios, ...j.skills, ...j.files, ...j.tests, ...j.dependencies]) assert.ok(item.why, 'every item has a reason');

  const text = run(['context', 'suggest', 'duplicate notifications', '--dir', root]).out;
  assert.match(text, /Level 1 · scenarios/);
  assert.match(text, /not a substitute/);
});

test('context suggest: no scenario match is flagged; bad usage fails', () => {
  const root = path.join(scratch, 'noscenario');
  write(root, 'src/app.js', 'module.exports = {};\n');
  assert.match(run(['context', 'suggest', 'pagination', '--dir', root]).out, /No matching scenario/);
  assert.strictEqual(run(['context', 'suggest', '--dir', root]).code, 1);
  assert.match(run(['context', 'inspect']).err, /Unknown context command/);
});
