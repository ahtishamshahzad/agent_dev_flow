#!/usr/bin/env node
'use strict';

/**
 * Blind scoring: a separate model judges each transcript against its case's
 * expected properties, without being told which arm produced it.
 *
 *   node evals/score.js <raw-dir> [<raw-dir> ...] [--judge <model>] [--concurrency N] [--out <file.md>]
 *
 * Blinding: the judge sees only the case's properties and the agent's final
 * response, with AgentFlow-identifying text masked — `.ai/…` paths, rule-file
 * names, "AgentFlow", gate numbers. It is told nothing about arms. Masking can't
 * hide a process *style* (an AgentFlow answer still tends to stop for approval),
 * so this removes the scorer's knowledge of the arm, not every tell — say so
 * when reporting.
 *
 * The judge runs headless with no tools, in an empty temp dir, user settings
 * excluded. Its verdicts (pass/fail + a quote per property) are saved next to
 * the transcript as `<id>.score.json`, and a summary table is printed.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const EVALS = __dirname;

function args() {
  const a = { dirs: [], judge: null, concurrency: 4, out: null, resume: false };
  const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) {
    if (v[i] === '--resume') a.resume = true;
    else if (v[i] === '--judge') a.judge = v[++i];
    else if (v[i] === '--concurrency') a.concurrency = Number(v[++i]) || 4;
    else if (v[i] === '--out') a.out = v[++i];
    else a.dirs.push(v[i]);
  }
  if (!a.dirs.length) { console.error('usage: node evals/score.js <raw-dir> ... [--judge model] [--out file]'); process.exit(1); }
  return a;
}

function mask(text) {
  return String(text)
    .replace(/`?\.ai\/[^\s`'")\]]*`?/g, '[project rules]')
    .replace(/\b[A-Z_]+_RULES\.md\b/g, '[project rules]')
    .replace(/\b(CLAUDE|AGENTS)\.md\b/g, '[project instructions]')
    .replace(/\bAgentFlow\b/gi, '[system]')
    .replace(/\bGate\s*[1-7]\b/gi, 'approval step');
}

function propertiesFor(rec) {
  const base = rec.suite === 'workflow-checks' ? path.join(EVALS, 'workflow-checks') : EVALS;
  const file = path.join(base, rec.case, 'expected-properties.md');
  const text = fs.readFileSync(file, 'utf8');
  const ids = [...text.matchAll(/^\|\s*(P\d+)\s*\|/gm)].map((m) => m[1]);
  return { text: mask(text), ids };
}

function judge(prompt, model) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentflow-judge-'));
  const argv = ['-p', prompt, '--output-format', 'json', '--setting-sources', 'project',
    '--disallowedTools', 'Bash,Read,Glob,Grep,Write,Edit,NotebookEdit,WebFetch,WebSearch,Agent',
    '--max-turns', '2', '--no-session-persistence'];
  if (model) argv.push('--model', model);
  return new Promise((resolve) => {
    const child = spawn('claude', argv, { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', (d) => { out += d; });
    child.on('close', () => {
      fs.rmSync(dir, { recursive: true, force: true });
      try {
        const j = JSON.parse(out);
        const m = /\{[\s\S]*\}/.exec(j.result || '');
        resolve({ verdict: m ? JSON.parse(m[0]) : null, cost: j.total_cost_usd, raw: j.result });
      } catch (e) { resolve({ verdict: null, raw: out.slice(0, 2000), error: e.message }); }
    });
  });
}

async function main() {
  const a = args();
  const records = a.dirs.flatMap((d) => fs.readdirSync(d)
    .filter((f) => f.endsWith('.json') && !f.endsWith('.score.json'))
    .map((f) => ({ file: path.join(d, f), rec: JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')) })));
  console.log(`${records.length} transcript(s) to score · judge ${a.judge || 'default model'}`);

  // Only the CLI's short limit reply — never an answer that mentions rate limits.
  const LIMIT_RE = /^\s*(you'?ve hit your [a-z ]*limit|claude ai usage limit reached|[a-z ]*usage limit reached)/i;
  const LIMIT = { test: (s) => String(s).length < 300 && LIMIT_RE.test(String(s)) };
  let next = 0;
  let cost = 0;
  let stopped = null;
  const worker = async () => {
    while (next < records.length && !stopped) {
      const { file, rec } = records[next++];
      if (LIMIT.test(String(rec.result || ''))) { console.log(`skip ${rec.id} (transcript is a usage-limit reply)`); continue; }
      const scoreFile = file.replace(/\.json$/, '.score.json');
      if (a.resume) {
        try { if (JSON.parse(fs.readFileSync(scoreFile, 'utf8')).verdict) { console.log(`skip ${rec.id} (scored)`); continue; } } catch { /* score it */ }
      }
      const props = propertiesFor(rec);
      const prompt = [
        'You are scoring one response from an AI coding agent against a fixed list of properties.',
        'Judge only what the response text shows. Quote the exact sentence that earns each pass.',
        'A property with no supporting quote fails. The agent had read-only tools; do not penalize it for not writing files.',
        'Reply with ONLY a JSON object: {"P1": {"pass": true|false, "quote": "..."}, ...} for exactly these ids: ' + props.ids.join(', '),
        '', '## Properties', props.text,
        '', '## The task the agent was given', mask(rec.prompt),
        '', '## The agent\'s response', mask(rec.result),
      ].join('\n');
      const res = await judge(prompt, a.judge);
      if (!res.verdict && LIMIT.test(String(res.raw || ''))) { stopped = String(res.raw).trim().slice(0, 120); break; }
      cost += res.cost || 0;
      const score = { id: rec.id, case: rec.case, arm: rec.arm, run: rec.run, model: (rec.models || []).join(','),
        judge: a.judge || 'default', properties: props.ids, verdict: res.verdict, error: res.error, raw: res.verdict ? undefined : res.raw };
      fs.writeFileSync(file.replace(/\.json$/, '.score.json'), JSON.stringify(score, null, 2));
      const passed = res.verdict ? props.ids.filter((id) => res.verdict[id] && res.verdict[id].pass).length : '?';
      console.log(`${res.verdict ? 'ok  ' : 'FAIL'} ${rec.id} ${passed}/${props.ids.length}`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(a.concurrency, records.length) }, worker));
  console.log(`judge cost: $${cost.toFixed(2)}`);
  if (stopped) { console.error(`STOPPED — usage limit reached (${stopped}). Re-run later with --resume.`); process.exit(2); }
}

main().catch((e) => { console.error(e); process.exit(1); });
