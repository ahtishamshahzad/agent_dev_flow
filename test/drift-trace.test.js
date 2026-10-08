'use strict';

// `agentflow drift` against a local fake registry + Node schedule (no network),
// and `agentflow gherkin trace` against temp feature and test files.

const { test, before, after } = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { satisfies, smallestSafe, latestStable } = require('../lib/drift');

const CLI = path.resolve(__dirname, '..', 'bin', 'cli.js');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-drift-'));
let server;
let base;

const versions = (...vs) => Object.fromEntries(vs.map((v) => [v, {}]));
const PACKAGES = {
  express: { 'dist-tags': { latest: '5.2.1' }, versions: versions('4.19.2', '4.20.0', '4.21.2', '5.0.0', '5.2.1') },
  jsonwebtoken: { 'dist-tags': { latest: '9.0.3' }, versions: versions('8.5.1', '9.0.0', '9.0.3') },
  lodash: { 'dist-tags': { latest: '4.17.21' }, versions: versions('4.17.21') },
  oldlib: { 'dist-tags': { latest: '2.0.0' }, versions: { '1.0.0': { deprecated: 'use newlib' }, '2.0.0': {} } },
  betalib: { 'dist-tags': { latest: '3.0.0-beta.1' }, versions: versions('2.4.0', '3.0.0-beta.1') },
};
const ADVISORIES = {
  express: [{ title: 'XSS in redirect', url: 'https://x/1', severity: 'low', vulnerable_versions: '<4.20.0' }],
  jsonwebtoken: [{ title: 'bypass', url: 'https://x/2', severity: 'high', vulnerable_versions: '<9.0.0' }],
};

before(async () => {
  server = http.createServer((req, res) => {
    const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)); };
    if (req.url === '/schedule.json') return send(200, { v16: { end: '2023-09-11', lts: '2021-10-26' }, v24: { end: '2028-04-30', lts: '2025-10-28' } });
    if (req.method === 'POST') {
      let body = '';
      req.on('data', (d) => { body += d; });
      return req.on('end', () => {
        const asked = JSON.parse(body);
        send(200, Object.fromEntries(Object.keys(asked).filter((n) => ADVISORIES[n]).map((n) => [n, ADVISORIES[n]])));
      });
    }
    const name = decodeURIComponent(req.url.slice(1));
    return PACKAGES[name] ? send(200, PACKAGES[name]) : send(404, {});
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => { server.close(); fs.rmSync(scratch, { recursive: true, force: true }); });

function project(name, { deps, lock, nvmrc, engines }) {
  const dir = path.join(scratch, name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name, version: '1.0.0', dependencies: deps, engines }));
  if (lock) fs.writeFileSync(path.join(dir, 'package-lock.json'), JSON.stringify({
    lockfileVersion: 3, packages: Object.fromEntries(Object.entries(lock).map(([n, v]) => [`node_modules/${n}`, { version: v }])),
  }));
  if (nvmrc) fs.writeFileSync(path.join(dir, '.nvmrc'), `${nvmrc}\n`);
  return dir;
}

function run(args, cwd = scratch) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [CLI, ...args], {
      cwd, env: { ...process.env, AGENTFLOW_NPM_REGISTRY: base, AGENTFLOW_NODE_SCHEDULE: `${base}/schedule.json` },
    });
    let out = ''; let err = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', (code) => resolve({ code, out, err }));
  });
}

test('semver helpers: ranges, stable latest, smallest safe version', () => {
  assert.ok(satisfies('4.19.2', '<4.20.0'));
  assert.ok(!satisfies('4.20.0', '<4.20.0'));
  assert.ok(satisfies('2.0.5', '>=2.0.0 <2.1.0 || <1.0.0'));
  assert.strictEqual(latestStable(PACKAGES.betalib), '2.4.0', 'a pre-release `latest` tag is skipped');
  assert.strictEqual(smallestSafe(PACKAGES.express, '4.19.2', ADVISORIES.express), '4.20.0');
});

test('drift: newer available but no trigger → not recommended', async () => {
  const dir = project('fine', { deps: { lodash: '^4.17.0', express: '^5.0.0' }, lock: { lodash: '4.17.21', express: '5.0.0' }, nvmrc: 24 });
  const r = await run(['drift', dir, '--json']);
  assert.strictEqual(r.code, 0, r.err);
  const j = JSON.parse(r.out);
  const express = j.rows.find((x) => x.name === 'express');
  assert.strictEqual(express.available, true);
  assert.strictEqual(express.recommended, false, 'newer alone is not a reason');
  assert.strictEqual(j.runtime.recommended, false);
});

test('drift: advisories, smallest safe fix, deprecation, and EOL runtime are triggers', async () => {
  const dir = project('triggers', {
    deps: { express: '^4.19.2', jsonwebtoken: '^8.5.1', oldlib: '^1.0.0' },
    lock: { express: '4.19.2', jsonwebtoken: '8.5.1', oldlib: '1.0.0' }, nvmrc: 16,
  });
  const j = JSON.parse((await run(['drift', dir, '--json'])).out);
  const row = (n) => j.rows.find((x) => x.name === n);
  assert.strictEqual(row('express').recommended, true);
  assert.strictEqual(row('express').fixedIn, '4.20.0');
  assert.strictEqual(row('express').fixSameMajor, true, 'patch within the same major');
  assert.strictEqual(row('jsonwebtoken').fixedIn, '9.0.0');
  assert.strictEqual(row('jsonwebtoken').fixSameMajor, false);
  assert.strictEqual(row('jsonwebtoken').triggers[0].urgency, 'high');
  assert.ok(row('oldlib').triggers.some((t) => t.kind === 'deprecated'));
  assert.strictEqual(j.runtime.recommended, true);
  assert.match(j.runtime.triggers[0].detail, /end of life on 2023-09-11/);

  const text = await run(['drift', dir]);
  assert.match(text.out, /smallest safe version: 4\.20\.0 \(same major/);
  assert.match(text.out, /node 16 .*end of life/);
});

test('drift: --fail-on gates CI only on the requested trigger', async () => {
  const secure = project('secure', { deps: { lodash: '^4.17.0' }, lock: { lodash: '4.17.21' }, nvmrc: 16 });
  assert.strictEqual((await run(['drift', secure, '--fail-on', 'security'])).code, 0);
  assert.strictEqual((await run(['drift', secure, '--fail-on', 'eol'])).code, 1);
  const vuln = project('vuln', { deps: { jsonwebtoken: '^8.5.1' }, lock: { jsonwebtoken: '8.5.1' } });
  assert.strictEqual((await run(['drift', vuln, '--fail-on', 'security'])).code, 1);
  assert.match((await run(['drift', vuln, '--fail-on', 'nope'])).err, /--fail-on must be/);
});

test('drift: without a lock file, versions are reported as ranges, not guessed', async () => {
  const dir = project('nolock', { deps: { lodash: '^4.17.0' } });
  const r = await run(['drift', dir]);
  assert.match(r.out, /\^4\.17\.0 \(range\)/);
  assert.match(r.out, /installed versions unknown/);
});

test('drift: a missing package.json fails clearly', async () => {
  const r = await run(['drift', path.join(scratch)]);
  assert.strictEqual(r.code, 1);
  assert.match(r.err, /no package\.json/);
});

test('gherkin trace: finds untested scenarios and fails only on @critical ones', async () => {
  const dir = path.join(scratch, 'trace');
  fs.mkdirSync(path.join(dir, 'features'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'test'));
  fs.writeFileSync(path.join(dir, 'features', 'sign-in.feature'), [
    'Feature: Sign in', '',
    '  @critical', '  Scenario: Member signs in with the right password', '    Given a', '    When b', '    Then c', '',
    '  Scenario: Locked account is refused', '    Given a', '    When b', '    Then c', '',
  ].join('\n'));
  const tests = path.join(dir, 'test', 'sign-in.test.js');
  fs.writeFileSync(tests, "test('Locked account is refused', () => {});\n");

  let r = await run(['gherkin', 'trace', 'features', '--tests', 'test'], dir);
  assert.strictEqual(r.code, 1, 'an untested @critical scenario fails');
  assert.match(r.out, /no test \(critical\)\s+Member signs in with the right password/);

  fs.appendFileSync(tests, "test('member  signs in with the RIGHT password', () => {});\n");
  r = await run(['gherkin', 'trace', 'features', '--tests', 'test'], dir);
  assert.strictEqual(r.code, 0, 'title match ignores case and spacing');
  assert.match(r.out, /2 scenario\(s\), 2 with a test/);
});
