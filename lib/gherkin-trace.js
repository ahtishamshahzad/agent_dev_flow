'use strict';

/**
 * Scenario → test traceability (.ai/system/GHERKIN_RULES.md, "every scenario maps
 * to a named test"). Convention: a test's name contains its scenario's title.
 * This finds scenarios no test file mentions. It proves a test *exists* for each
 * scenario — not that it passes; that is CI's job.
 */

const fs = require('fs');
const path = require('path');

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.ai']);
const TEST_EXT = /\.(c|m)?(j|t)sx?$|\.py$|\.rb$|\.go$|\.java$|\.kt$|\.swift$|\.cs$|\.php$|\.yaml$|\.yml$/;

const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();

function walk(p, out, pred) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const c of fs.readdirSync(p)) if (!SKIP.has(c)) walk(path.join(p, c), out, pred);
  } else if (pred(p)) out.push(p);
  return out;
}

// Scenarios with their effective tags (feature tags + scenario tags).
function scenarios(file) {
  const out = [];
  let featureTags = [];
  let pending = [];
  let inFeature = false;
  fs.readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
    const t = line.trim();
    if (t.startsWith('@')) { pending.push(...t.split(/\s+/)); return; }
    const m = /^(Feature|Scenario Outline|Scenario Template|Scenario|Example):\s*(.*)$/.exec(t);
    if (!m) return;
    if (m[1] === 'Feature') { featureTags = pending; inFeature = true; pending = []; return; }
    if (inFeature && m[2]) out.push({ file, line: i + 1, title: m[2].trim(), tags: [...featureTags, ...pending] });
    pending = [];
  });
  return out;
}

function trace(featureRoots, testRoots) {
  const features = featureRoots.flatMap((r) => walk(r, [], (p) => p.endsWith('.feature')));
  const tests = testRoots.flatMap((r) => walk(r, [], (p) => TEST_EXT.test(p)));
  const corpus = tests.map((p) => ({ p, text: norm(fs.readFileSync(p, 'utf8')) }));
  const all = features.flatMap(scenarios);
  for (const s of all) {
    const needle = norm(s.title);
    s.tests = corpus.filter((t) => t.text.includes(needle)).map((t) => t.p);
  }
  return { features, tests, scenarios: all };
}

module.exports = { trace, scenarios };
