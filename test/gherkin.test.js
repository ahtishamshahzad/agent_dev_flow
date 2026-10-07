'use strict';

// The Gherkin linter (lib/gherkin-lint.js) and `agentflow gherkin validate`.
// Each contract rule gets one failing input; the shipped examples must pass.

const { test, after } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { lint } = require('../lib/gherkin-lint');

const ROOT = path.resolve(__dirname, '..');
const CLI = path.join(ROOT, 'bin', 'cli.js');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-gherkin-'));
after(() => fs.rmSync(scratch, { recursive: true, force: true }));

const errors = (text, file = 'sample.feature') =>
  lint(text, file).filter((p) => p.level === 'error').map((p) => p.message);

const GOOD = `Feature: Sign in

  Scenario: Member signs in with the right password
    Given Ana has an account
    When Ana signs in with her password
    Then Ana sees her dashboard
`;

test('a well-formed feature has no errors', () => {
  assert.deepStrictEqual(errors(GOOD), []);
});

test('every shipped example passes', () => {
  const dir = path.join(ROOT, 'examples', 'gherkin');
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.feature'))) {
    assert.deepStrictEqual(lint(fs.readFileSync(path.join(dir, f), 'utf8'), f), [], f);
  }
});

const cases = [
  ['no Feature', 'Scenario: x\n', /before Feature|no Feature/],
  ['two Features', `${GOOD}\nFeature: Again\n`, /only one Feature/],
  ['untitled Feature', 'Feature:\n', /Feature needs a title/],
  ['no scenarios', 'Feature: Empty\n', /has no scenarios/],
  ['untitled scenario', 'Feature: F\n\n  Scenario:\n    Given a\n    When b\n    Then c\n', /needs a title/],
  ['empty scenario', 'Feature: F\n\n  Scenario: Nothing happens\n', /has no steps/],
  ['missing Then', 'Feature: F\n\n  Scenario: S\n    Given a\n    When b\n', /no Then step/],
  ['missing When', 'Feature: F\n\n  Scenario: S\n    Given a\n    Then c\n', /no When step/],
  ['Given after When', 'Feature: F\n\n  Scenario: S\n    When b\n    Given a\n    Then c\n', /strict Given → When → Then/],
  ['repeated When', 'Feature: F\n\n  Scenario: S\n    Given a\n    When b\n    When c\n    Then d\n', /repeated "When"/],
  ['Or step', 'Feature: F\n\n  Scenario: S\n    Given a\n    When b\n    Or c\n    Then d\n', /"Or" is not allowed/],
  ['And first', 'Feature: F\n\n  Scenario: S\n    And a\n    When b\n    Then c\n', /cannot start/],
  ['blank between steps', 'Feature: F\n\n  Scenario: S\n    Given a\n\n    When b\n    Then c\n', /no blank lines between steps/],
  ['bad indentation', 'Feature: F\n\n  Scenario: S\n  Given a\n    When b\n    Then c\n', /indented 4 spaces/],
  ['malformed step', 'Feature: F\n\n  Scenario: S\n    Given a\n    Whne b\n    Then c\n', /not a step/],
  ['duplicate titles', `${GOOD}\n  Scenario: Member signs in with the right password\n    Given a\n    When b\n    Then c\n`, /duplicate scenario title/],
  ['two Backgrounds', 'Feature: F\n\n  Background:\n    Given a\n\n  Background:\n    Given b\n\n  Scenario: S\n    Given a\n    When b\n    Then c\n', /only one Background/],
  ['Background with When', 'Feature: F\n\n  Background:\n    Given a\n    When b\n\n  Scenario: S\n    Given a\n    When b\n    Then c\n', /only contain Given/],
  ['Outline without Examples', 'Feature: F\n\n  Scenario Outline: S\n    Given <a>\n    When b\n    Then c\n', /has no Examples/],
  ['unknown placeholder', 'Feature: F\n\n  Scenario Outline: S\n    Given <a>\n    When <b>\n    Then c\n\n    Examples:\n      | a |\n      | 1 |\n', /<b> is not a column/],
  ['Examples without rows', 'Feature: F\n\n  Scenario Outline: S\n    Given <a>\n    When b\n    Then c\n\n    Examples:\n      | a |\n', /no rows/],
  ['bad tag', '@Critical\nFeature: F\n\n  Scenario: S\n    Given a\n    When b\n    Then c\n', /@kebab-case/],
];
for (const [name, text, re] of cases) {
  test(`rejects: ${name}`, () => {
    assert.ok(errors(text).some((m) => re.test(m)), `${name}: got ${JSON.stringify(errors(text))}`);
  });
}

test('rejects a file name that is not kebab-case', () => {
  assert.ok(errors(GOOD, 'SignIn.feature').some((m) => /kebab-case/.test(m)));
});

test('long lines and comments are warnings, not errors', () => {
  const text = `${GOOD}  # a note\n`;
  const out = lint(text, 'sample.feature');
  assert.ok(out.some((p) => p.level === 'warning' && /comments/.test(p.message)));
  assert.deepStrictEqual(errors(text), []);
});

function cli(args, cwd) {
  const r = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

test('gherkin validate passes on valid files and defaults to features/', () => {
  const dir = path.join(scratch, 'ok');
  fs.mkdirSync(path.join(dir, 'features', 'auth'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'features', 'auth', 'sign-in.feature'), GOOD);
  const r = cli(['gherkin', 'validate'], dir);
  assert.strictEqual(r.code, 0, r.err);
  assert.match(r.out, /1 feature file\(s\), 0 error\(s\)/);
});

test('gherkin validate fails with file:line on an invalid file', () => {
  const dir = path.join(scratch, 'bad');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'broken.feature'), 'Feature: F\n\n  Scenario: S\n    Given a\n    When b\n');
  const r = cli(['gherkin', 'validate', '.'], dir);
  assert.strictEqual(r.code, 1);
  assert.match(r.out, /broken\.feature:3 .*no Then step/);
  assert.match(r.err, /1 error\(s\)/);
});

test('gherkin validate fails when there is nothing to check or the command is wrong', () => {
  const dir = path.join(scratch, 'empty');
  fs.mkdirSync(dir);
  assert.strictEqual(cli(['gherkin', 'validate', '.'], dir).code, 1);
  assert.strictEqual(cli(['gherkin', 'validate', 'missing'], dir).code, 1);
  assert.match(cli(['gherkin'], dir).err, /Missing gherkin command/);
  assert.match(cli(['gherkin', 'lint'], dir).err, /Unknown gherkin command: lint/);
});
