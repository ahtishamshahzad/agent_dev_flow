#!/usr/bin/env node
'use strict';

/**
 * Aggregates blind scores (`*.score.json` from score.js) into a Markdown table:
 * per case and arm, the mean property pass rate across runs, the per-run spread,
 * and per-property differences. Also mean cost, turns, and time per arm.
 *
 *   node evals/summarize.js <raw-dir> [<raw-dir> ...]
 */

const fs = require('fs');
const path = require('path');

const dirs = process.argv.slice(2);
if (!dirs.length) { console.error('usage: node evals/summarize.js <raw-dir> ...'); process.exit(1); }

const runs = [];
for (const d of dirs) {
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.score.json'))) {
    const s = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
    const rec = JSON.parse(fs.readFileSync(path.join(d, f.replace('.score.json', '.json')), 'utf8'));
    if (!s.verdict) { runs.push({ ...s, unscored: true }); continue; }
    const passed = s.properties.filter((id) => s.verdict[id] && s.verdict[id].pass);
    runs.push({ ...s, passed, total: s.properties.length, cost: rec.costUsd || 0, turns: rec.turns || 0, ms: rec.durationMs || 0 });
  }
}

const by = (keyFn) => runs.reduce((m, r) => { (m[keyFn(r)] = m[keyFn(r)] || []).push(r); return m; }, {});
const pct = (n) => `${Math.round(n * 100)}%`;
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);

const scored = runs.filter((r) => !r.unscored);
const unscored = runs.filter((r) => r.unscored);
const models = [...new Set(scored.map((r) => r.model))].sort();
const cases = [...new Set(scored.map((r) => r.case))].sort();
const arms = [...new Set(scored.map((r) => r.arm))].sort();

const lines = [];
for (const model of models) {
  lines.push(`### ${model}`, '');
  lines.push(`| Case | ${arms.map((a) => `${a} (mean · runs)`).join(' | ')} | Properties that differ (pass rate by arm) |`);
  lines.push(`|---|${arms.map(() => '---').join('|')}|---|`);
  for (const c of cases) {
    const cells = [];
    const rates = {};
    for (const arm of arms) {
      const rs = scored.filter((r) => r.model === model && r.case === c && r.arm === arm);
      if (!rs.length) { cells.push('—'); continue; }
      const each = rs.map((r) => r.passed.length / r.total);
      cells.push(`${pct(mean(each))} · ${rs.map((r) => `${r.passed.length}/${r.total}`).join(', ')}`);
      for (const id of rs[0].properties) {
        rates[id] = rates[id] || {};
        rates[id][arm] = mean(rs.map((r) => (r.passed.includes(id) ? 1 : 0)));
      }
    }
    const diffs = Object.entries(rates)
      .filter(([, v]) => arms.length > 1 && Math.abs((v[arms[0]] ?? 0) - (v[arms[1]] ?? 0)) >= 0.34)
      .map(([id, v]) => `${id} ${arms.map((a) => pct(v[a] ?? 0)).join('→')}`);
    lines.push(`| ${c} | ${cells.join(' | ')} | ${diffs.join(' · ') || '—'} |`);
  }
  const totals = arms.map((arm) => {
    const rs = scored.filter((r) => r.model === model && r.arm === arm);
    return { arm, rate: mean(rs.map((r) => r.passed.length / r.total)), cost: mean(rs.map((r) => r.cost)),
      turns: mean(rs.map((r) => r.turns)), s: mean(rs.map((r) => r.ms)) / 1000, n: rs.length };
  });
  lines.push('', `| Arm | Runs | Mean pass rate | Mean cost | Mean turns | Mean time |`, '|---|---|---|---|---|---|');
  for (const t of totals) lines.push(`| ${t.arm} | ${t.n} | ${pct(t.rate)} | $${t.cost.toFixed(3)} | ${t.turns.toFixed(1)} | ${Math.round(t.s)} s |`);
  lines.push('');
}
if (unscored.length) lines.push(`Unscored (judge returned no verdict): ${unscored.map((r) => r.id).join(', ')}`, '');
console.log(lines.join('\n'));
