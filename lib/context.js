'use strict';

/**
 * Context engineering helpers (.ai/system/CONTEXT_MANAGEMENT_RULES.md).
 * Deterministic and explainable — no embeddings, no index to maintain.
 *
 *   check(root, {update})  stable summaries in .ai/projects/current/context/*.md
 *                          declare `sources:` and a `fingerprint:`; reports
 *                          which are stale because their sources changed.
 *   suggest(root, task)    ranks scenarios, skills, files, tests, and direct
 *                          dependencies for a task, each with the reason.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SKIP = new Set(['node_modules', '.git', '.ai', 'dist', 'build', 'coverage', '.next', '.expo', 'vendor', '__pycache__']);
const SOURCE = /\.(c|m)?(j|t)sx?$|\.py$|\.rb$|\.go$|\.java$|\.kt$|\.swift$|\.cs$|\.php$|\.prisma$|\.sql$|\.ya?ml$|\.json$/;
const TEST = /(^|[/.])(test|tests|spec|__tests__)([/.]|$)|\.(test|spec)\.[a-z]+$/i;
const STOP = new Set(('a an and are as at be but by do does for from has have how i if in into is it its make me my no not of on or our please should so that the their them then there these this to up us use we when where which while who why will with you your add fix bug change update new create remove make get set').split(' '));

function walk(dir, out = [], root = dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out, root);
    else out.push(path.relative(root, p).split(path.sep).join('/'));
  }
  return out;
}

// --- check ------------------------------------------------------------------------
function frontmatter(text) {
  const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!m) return null;
  const fm = { sources: [], raw: m[0] };
  let inSources = false;
  for (const line of m[1].split('\n')) {
    const item = /^\s+-\s+(.+?)\s*(#.*)?$/.exec(line);
    if (inSources && item) { fm.sources.push(item[1].replace(/^["']|["']$/g, '')); continue; }
    const kv = /^(\w+):\s*(.*?)\s*(#.*)?$/.exec(line);
    inSources = !!kv && kv[1] === 'sources' && !kv[2];
    if (kv && kv[1] !== 'sources') fm[kv[1]] = kv[2];
  }
  return fm;
}

function globToRe(g) {
  const re = g.split('/').map((seg) => (seg === '**' ? '(?:.*/)?' : `${seg.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]')}/`)).join('');
  return new RegExp(`^${re.replace(/\/$/, '').replace(/\(\?:\.\*\/\)\?$/, '.*')}$`);
}

function expand(root, sources, files) {
  const hits = new Set();
  for (const s of sources) {
    if (!/[*?]/.test(s)) { hits.add(s); continue; }
    const re = globToRe(s);
    for (const f of files()) if (re.test(f)) hits.add(f);
  }
  return [...hits].sort();
}

function fingerprint(root, paths) {
  const h = crypto.createHash('sha256');
  for (const rel of paths) {
    h.update(`${rel}\0`);
    const p = path.join(root, rel);
    h.update(fs.existsSync(p) ? fs.readFileSync(p) : 'MISSING');
    h.update('\0');
  }
  return h.digest('hex').slice(0, 16);
}

function check(root, { update = false, today = new Date().toISOString().slice(0, 10) } = {}) {
  const dir = path.join(root, '.ai', 'projects', 'current', 'context');
  if (!fs.existsSync(dir)) return { dir, summaries: [] };
  let cache = null;
  const files = () => (cache = cache || walk(root));
  const summaries = [];
  for (const name of fs.readdirSync(dir).filter((f) => f.endsWith('.md') && f !== 'README.md').sort()) {
    const file = path.join(dir, name);
    const text = fs.readFileSync(file, 'utf8');
    const fm = frontmatter(text);
    if (!fm || !fm.sources.length) { summaries.push({ name, status: 'no-sources' }); continue; }
    const paths = expand(root, fm.sources, files);
    const missing = paths.filter((p) => !fs.existsSync(path.join(root, p)));
    const fp = fingerprint(root, paths);
    const recorded = fm.fingerprint && !/^</.test(fm.fingerprint) ? fm.fingerprint : null;
    let status = !recorded ? 'unfingerprinted' : recorded === fp ? 'fresh' : 'stale';
    if (update && status !== 'fresh') {
      let body = fm.raw;
      body = /^fingerprint:.*$/m.test(body) ? body.replace(/^fingerprint:.*$/m, `fingerprint: ${fp}`) : body.replace(/\n---\n$/, `\nfingerprint: ${fp}\n---\n`);
      body = /^updated:.*$/m.test(body) ? body.replace(/^updated:.*$/m, `updated: ${today}`) : body.replace(/\n---\n$/, `\nupdated: ${today}\n---\n`);
      fs.writeFileSync(file, body + text.slice(fm.raw.length));
      status = 'updated';
    }
    summaries.push({ name, status, sources: paths, missing, fingerprint: fp });
  }
  return { dir, summaries };
}

// --- suggest ----------------------------------------------------------------------
function terms(task) {
  const words = String(task).toLowerCase().match(/[a-z0-9]+/g) || [];
  const out = new Set();
  for (const w of words) {
    if (w.length < 3 || STOP.has(w)) continue;
    out.add(w);
    // Light, predictable stemming: plurals and -ing/-ed only.
    let stem = w;
    if (/ies$/.test(w)) stem = w.replace(/ies$/, 'y');
    else if (/(ss|us|is)$/.test(w)) stem = w;
    else if (/(sh|ch|x|z)es$/.test(w)) stem = w.slice(0, -2);
    else if (/s$/.test(w)) stem = w.slice(0, -1);
    else if (/ing$/.test(w) && w.length > 6) stem = w.slice(0, -3);
    else if (/ed$/.test(w) && w.length > 5) stem = w.slice(0, -2);
    if (stem !== w && stem.length >= 4) out.add(stem);
  }
  return [...out];
}

function matches(text, ts) {
  const t = text.toLowerCase();
  return ts.filter((w) => t.includes(w));
}

function suggest(root, task, { limit = 8 } = {}) {
  const ts = terms(task);
  const all = walk(root);
  const result = { task, terms: ts, scenarios: [], skills: [], files: [], tests: [], dependencies: [] };
  if (!ts.length) return result;

  // Level 1 — scenarios (the strongest anchor) and skills from the intent index.
  for (const f of all.filter((p) => p.endsWith('.feature'))) {
    const lines = fs.readFileSync(path.join(root, f), 'utf8').split('\n');
    const feature = (lines.find((l) => /^\s*Feature:/.test(l)) || '').trim();
    lines.forEach((l, i) => {
      const m = /^\s*(Scenario(?: Outline)?|Example):\s*(.+)$/.exec(l);
      if (!m) return;
      const hit = matches(`${feature} ${m[2]}`, ts);
      if (hit.length) result.scenarios.push({ path: `${f}:${i + 1}`, title: m[2].trim(), score: hit.length, why: `scenario matches "${hit.join('", "')}"` });
    });
  }
  result.scenarios.sort((a, b) => b.score - a.score).splice(limit);

  const index = path.join(root, '.ai', 'skills', 'SKILLS_INDEX.md');
  if (fs.existsSync(index)) {
    for (const row of fs.readFileSync(index, 'utf8').split('\n').filter((l) => /^\|[^|-]/.test(l))) {
      const intent = row.split('|')[1] || '';
      const hit = matches(intent, ts);
      const skills = [...row.matchAll(/\[`([a-z0-9-]+)`\]\(([^)]+)\)/g)].map((m) => ({ name: m[1], path: `.ai/skills/${m[2]}` }));
      if (hit.length && skills.length) {
        for (const s of skills) result.skills.push({ ...s, score: hit.length, why: `intent "${intent.trim()}" matches "${hit.join('", "')}"` });
      }
    }
    const seen = new Set();
    result.skills = result.skills.sort((a, b) => b.score - a.score).filter((s) => !seen.has(s.name) && seen.add(s.name)).slice(0, 4);
  }

  // Level 2 — files by path match (strong) and content match (weak), then their tests.
  const code = all.filter((p) => SOURCE.test(p) && !p.endsWith('package-lock.json'));
  const scored = [];
  for (const f of code) {
    const pathHit = matches(f.replace(/[/_.-]/g, ' '), ts);
    let content = '';
    try { const st = fs.statSync(path.join(root, f)); if (st.size < 200000) content = fs.readFileSync(path.join(root, f), 'utf8'); } catch { /* unreadable */ }
    const bodyHit = matches(content, ts);
    const score = pathHit.length * 3 + bodyHit.length;
    if (score) scored.push({ path: f, score, test: TEST.test(f), why: pathHit.length ? `path matches "${pathHit.join('", "')}"` : `mentions "${bodyHit.join('", "')}"` });
  }
  scored.sort((a, b) => b.score - a.score || a.path.length - b.path.length);
  result.files = scored.filter((s) => !s.test).slice(0, limit);

  const base = (p) => path.basename(p).replace(/\.(test|spec)?\.?[a-z]+$/i, '').replace(/\.(test|spec)$/i, '').toLowerCase();
  const testFiles = code.filter((p) => TEST.test(p));
  for (const f of result.files) {
    for (const t of testFiles) {
      if (base(t) === base(f.path) || base(t).includes(base(f.path))) result.tests.push({ path: t, why: `tests ${f.path}` });
    }
  }
  for (const s of scored.filter((x) => x.test).slice(0, limit)) {
    if (!result.tests.some((t) => t.path === s.path)) result.tests.push({ path: s.path, why: s.why });
  }
  result.tests.splice(limit);

  // Level 3 — direct relative imports of the top files (only if layer 2 isn't enough).
  const exts = ['', '.js', '.ts', '.tsx', '.jsx', '.mjs', '.cjs', '/index.js', '/index.ts'];
  for (const f of result.files.slice(0, 4)) {
    const text = fs.readFileSync(path.join(root, f.path), 'utf8');
    for (const m of text.matchAll(/(?:require\(\s*|from\s+|import\s+)['"](\.{1,2}\/[^'"]+)['"]/g)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(f.path), m[1]));
      const hit = exts.map((e) => target + e).find((p) => fs.existsSync(path.join(root, p)));
      const shown = hit || `${target} (not in repo)`;
      if (!result.dependencies.some((d) => d.path === shown) && !result.files.some((x) => x.path === hit)) {
        result.dependencies.push({ path: shown, why: `imported by ${f.path}` });
      }
    }
  }
  result.dependencies.splice(limit);
  return result;
}

module.exports = { check, suggest, terms, frontmatter, globToRe };
