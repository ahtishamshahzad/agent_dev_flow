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
  const a = { suite: 'cases', case: null, arms: null, runs: 1, concurrency: 3, model: null, out: null, resume: false };
  const v = process.argv.slice(2);
  for (let i = 0; i < v.length; i++) {
    const k = v[i].replace(/^--/, '');
    if (!(k in a)) { console.error(`unknown option ${v[i]}`); process.exit(1); }
    if (k === 'resume') { a.resume = true; continue; }
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
  // A case may name its fixture in a `fixture` file ("none" = empty project).
  // Default: node-api for workflow checks, none for the comparison cases.
  const named = path.join(c.dir, 'fixture');
  const fixture = fs.existsSync(named) ? fs.readFileSync(named, 'utf8').trim()
    : suite === 'workflow-checks' ? 'node-api' : 'none';
  if (fixture !== 'none') copyDir(path.join(EVALS, 'fixtures', fixture), project);
  copyDir(path.join(c.dir, 'setup'), project);
  copyDir(path.join(c.dir, `setup-${arm}`), project);
  return project;
}

// A case may grant extra tools in a `tools` file, one per line — e.g. WebFetch,
// WebSearch, or a narrowed Bash pattern like `Bash(npm view:*)`. Granted tools
// are removed from the deny list; file writes stay denied.
function runAgent(project, prompt, model, extra = []) {
  const allowed = ['Read', 'Glob', 'Grep', ...extra];
  const grantedBase = new Set(extra.map((t) => t.replace(/\(.*$/, '')));
  const denied = ['Bash', 'Write', 'Edit', 'NotebookEdit', 'WebFetch', 'WebSearch', 'Agent']
    .filter((t) => !grantedBase.has(t) || ['Write', 'Edit', 'NotebookEdit'].includes(t));
  const argv = [
    '-p', prompt,
    '--output-format', 'stream-json', '--verbose',
    '--setting-sources', 'project',
    '--allowedTools', allowed.join(','),
    '--disallowedTools', denied.join(','),
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
      // stream-json: one event per line; the last `result` event carries the
      // usage and final text, assistant events carry the tool calls.
      let json = null;
      const tools = [];
      for (const line of out.split('\n')) {
        let ev;
        try { ev = JSON.parse(line); } catch { continue; }
        if (ev.type === 'result') json = ev;
        if (ev.type === 'assistant' && ev.message && Array.isArray(ev.message.content)) {
          for (const part of ev.message.content) if (part.type === 'tool_use') tools.push({ name: part.name, input: part.input || {} });
        }
      }
      resolve({ code, json, tools, raw: json ? null : out.slice(-4000), stderr: err.slice(-2000), ms: Date.now() - started });
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

  // A usage-limit reply is not a result: stop the batch rather than record it.
  // The CLI's limit reply is short ("You've hit your session limit · resets …");
  // a real answer that merely mentions "rate limits" must not match.
  const LIMIT_RE = /^\s*(you'?ve hit your [a-z ]*limit|claude ai usage limit reached|[a-z ]*usage limit reached)/i;
  const LIMIT = { test: (s) => String(s).length < 300 && LIMIT_RE.test(String(s)) };
  const done = (id) => {
    try {
      const j = JSON.parse(fs.readFileSync(path.join(out, `${id}.json`), 'utf8'));
      return j.exitCode === 0 && j.result && !LIMIT.test(j.result);
    } catch { return false; }
  };
  let next = 0;
  let stopped = null;
  const worker = async () => {
    while (next < jobs.length && !stopped) {
      const { c, arm, r } = jobs[next++];
      const id = `${c.name}-${arm}-${r}`;
      if (a.resume && done(id)) { console.log(`skip ${id} (already done)`); continue; }
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
      const toolsFile = path.join(c.dir, 'tools');
      const extra = fs.existsSync(toolsFile)
        ? fs.readFileSync(toolsFile, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean) : [];
      const res = await runAgent(project, prompt, a.model, extra);
      const j = res.json || {};
      if (LIMIT.test(String(j.result || res.raw || ''))) {
        stopped = `${id}: ${String(j.result || res.raw).trim().slice(0, 120)}`;
        fs.rmSync(project, { recursive: true, force: true });
        break;
      }
      // Context metrics from the tool calls: what was read, how often, and —
      // when the case lists its relevant files — how much of it was needed.
      const rel = (p) => path.relative(fs.realpathSync(project), path.resolve(fs.realpathSync(project), String(p))).split(path.sep).join('/');
      const reads = res.tools.filter((t) => t.name === 'Read' && t.input.file_path).map((t) => rel(t.input.file_path));
      const projectReads = reads.filter((p) => !p.startsWith('.ai/') && !p.startsWith('..'));
      const distinct = [...new Set(projectReads)];
      const relevantFile = path.join(c.dir, 'relevant.txt');
      const relevant = fs.existsSync(relevantFile) ? fs.readFileSync(relevantFile, 'utf8').split('\n').map((s) => s.trim()).filter(Boolean) : null;
      const context = {
        toolCalls: res.tools.length,
        byTool: res.tools.reduce((m, t) => ({ ...m, [t.name]: (m[t.name] || 0) + 1 }), {}),
        filesRead: distinct,
        systemFilesRead: [...new Set(reads.filter((p) => p.startsWith('.ai/')))].length,
        repeatedReads: projectReads.length - distinct.length,
        ...(relevant ? {
          relevant,
          retrievalEfficiency: distinct.length ? distinct.filter((f) => relevant.includes(f)).length / distinct.length : null,
          recall: relevant.filter((f) => distinct.includes(f)).length / relevant.length,
        } : {}),
      };
      const record = {
        id, case: c.name, suite: a.suite, arm, run: r, agentflowVersion: version, agent,
        models: Object.keys(j.modelUsage || {}), exitCode: res.code, durationMs: res.ms,
        turns: j.num_turns, costUsd: j.total_cost_usd, usage: j.usage, isError: j.is_error,
        projectFiles: files, extraTools: extra, context, prompt, result: j.result ?? res.raw, stderr: res.stderr || undefined,
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
  if (stopped) {
    console.error(`STOPPED — usage limit reached (${stopped}). Re-run later with --resume to continue.`);
    process.exit(2);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
