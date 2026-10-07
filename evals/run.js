#!/usr/bin/env node
'use strict';

/**
 * Runs AgentFlow evaluation cases against a real coding agent (Claude Code's
 * headless mode) and saves every transcript for scoring. It does not score —
 * a person (or a separate judge) does, with SCORESHEET.md.
 *
 *   node evals/run.js [--suite cases|workflow-checks] [--case a,b] [--arms baseline,agentflow]
 *                     [--runs N] [--concurrency N] [--model <name>] [--out <dir>]
 *
 * Each run gets a fresh project in the OS temp dir (outside any repository, so
 * no parent CLAUDE.md leaks in):
 *   - baseline arm:  case setup files only
 *   - agentflow arm: `agentflow init --editor claude` from this checkout, then setup files
 * The agent runs with user settings excluded (--setting-sources project: no
 * personal hooks or plugins), read-only tools (Read, Glob, Grep), and no
 * session persistence. Read-only is a deliberate constraint: the cases score
 * process and judgment from the transcript, and nothing a run does can touch
 * this machine. Note it as a deviation when comparing with interactive use.
 */

const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const EVALS = __dirname;
const ROOT = path.resolve(EVALS, '..');

function args() {
  const a = { suite: 'cases', case: null, arms: null, runs: 1, concurrency: 3, model: null, out: null };
  const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) {
    const k = v[i].replace(/^--/, '');
    if (!(k in a)) { console.error(`unknown option ${v[i]}`); process.exit(1); }
    a[k] = v[++i];
  }
  a.runs = Number(a.runs) || 1;
  a.concurrency = Number(a.concurrency) || 3;
  return a;
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.cpSync(src, dest, { recursive: true });
}

function cases(suite) {
  const base = suite === 'workflow-checks' ? path.join(EVALS, 'workflow-checks') : EVALS;
  return fs.readdirSync(base)
    .filter((d) => fs.existsSync(path.join(base, d, 'prompt.md')))
    .map((d) => ({ name: d, dir: path.join(base, d) }));
}

function prepare(c, arm, suite) {
  const project = fs.mkdtempSync(path.join(os.tmpdir(), `agentflow-eval-${c.name}-${arm}-`));
  if (arm === 'agentflow') {
    const r = spawnSync(process.execPath, [path.join(ROOT, 'bin', 'cli.js'), 'init', project, '--editor', 'claude'], { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`init failed: ${r.stderr}`);
  }
  if (suite === 'workflow-checks') copyDir(path.join(EVALS, 'fixtures', 'node-api'), project);
  copyDir(path.join(c.dir, 'setup'), project);
  copyDir(path.join(c.dir, `setup-${arm}`), project);
  return project;
}

function runAgent(project, prompt, model) {
  const argv = [
    '-p', prompt,
    '--output-format', 'json',
    '--setting-sources', 'project',
    '--allowedTools', 'Read,Glob,Grep',
    '--disallowedTools', 'Bash,Write,Edit,NotebookEdit,WebFetch,WebSearch,Agent',
    '--max-turns', '30',
    '--no-session-persistence',
  ];
  if (model) argv.push('--model', model);
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn('claude', argv, { cwd: project, stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    let err = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', (code) => {
      let json = null;
      try { json = JSON.parse(out); } catch { /* recorded below */ }
      resolve({ code, json, raw: json ? null : out, stderr: err.slice(-2000), ms: Date.now() - started });
    });
  });
}

async function main() {
  const a = args();
  const arms = (a.arms || (a.suite === 'workflow-checks' ? 'agentflow' : 'baseline,agentflow')).split(',');
  let list = cases(a.suite);
  if (a.case) list = list.filter((c) => a.case.split(',').includes(c.name));
  if (!list.length) { console.error('no cases matched'); process.exit(1); }

  const stamp = new Date().toISOString().slice(0, 10);
  const out = path.resolve(a.out || path.join(EVALS, 'results', 'raw', `${stamp}-${a.suite}`));
  fs.mkdirSync(out, { recursive: true });
  const version = fs.readFileSync(path.join(ROOT, '.ai', 'VERSION'), 'utf8').trim();
  const agent = spawnSync('claude', ['--version'], { encoding: 'utf8' }).stdout.trim();

  const jobs = [];
  for (const c of list) for (const arm of arms) for (let r = 1; r <= a.runs; r++) jobs.push({ c, arm, r });
  console.log(`${jobs.length} run(s) · ${agent} · AgentFlow ${version} · out ${path.relative(ROOT, out)}`);

  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const { c, arm, r } = jobs[next++];
      const id = `${c.name}-${arm}-${r}`;
      const project = prepare(c, arm, a.suite);
      // What the agent could see, outside the installed .ai/ system — recorded so a
      // transcript claiming "there is no code" can be checked against reality.
      const files = [];
      const list = (d, rel = '') => {
        for (const n of fs.readdirSync(d)) {
          const r = rel ? `${rel}/${n}` : n;
          if (r === '.ai' && arm === 'agentflow' && !fs.existsSync(path.join(c.dir, `setup-${arm}`, '.ai'))) continue;
          if (fs.statSync(path.join(d, n)).isDirectory()) list(path.join(d, n), r); else files.push(r);
        }
      };
      list(project);
      const prompt = fs.readFileSync(path.join(c.dir, 'prompt.md'), 'utf8').trim();
      const res = await runAgent(project, prompt, a.model);
      const j = res.json || {};
      const record = {
        id, case: c.name, suite: a.suite, arm, run: r, agentflowVersion: version, agent,
        models: Object.keys(j.modelUsage || {}), exitCode: res.code, durationMs: res.ms,
        turns: j.num_turns, costUsd: j.total_cost_usd, usage: j.usage, isError: j.is_error,
        projectFiles: files, prompt, result: j.result ?? res.raw, stderr: res.stderr || undefined,
      };
      fs.writeFileSync(path.join(out, `${id}.json`), JSON.stringify(record, null, 2));
      fs.writeFileSync(path.join(out, `${id}.md`),
        `# ${id}\n\n- Arm: **${arm}** · Case: \`${c.name}\` · Turns: ${record.turns} · ` +
        `Cost: $${record.costUsd} · ${Math.round(res.ms / 1000)} s\n- Project files (besides installed \`.ai/\`): ` +
        `${files.length ? files.map((f) => `\`${f}\``).join(', ') : 'none'}\n\n## Prompt\n\n${prompt}\n\n## Final response\n\n${record.result}\n`);
      fs.rmSync(project, { recursive: true, force: true });
      console.log(`${res.code === 0 ? 'ok  ' : 'FAIL'} ${id} (${Math.round(res.ms / 1000)} s)`);
    }
  };
  await Promise.all(Array.from({ length: Math.min(a.concurrency, jobs.length) }, worker));
}

main().catch((e) => { console.error(e); process.exit(1); });
