'use strict';

/**
 * Technology drift report (.ai/system/TECHNOLOGY_GOVERNANCE_RULES.md).
 *
 * For each direct dependency: installed version (lock file, else node_modules,
 * else the declared range), latest stable on the registry, advisories affecting
 * the installed version, deprecation — and for the runtime, end-of-life from the
 * official Node.js release schedule. "Upgrade available" is information;
 * "upgrade recommended" is yes only when a trigger applies. Newer alone is not one.
 *
 * Zero dependencies; Node >= 18 (global fetch). Endpoints are overridable for
 * tests and mirrors: AGENTFLOW_NPM_REGISTRY, AGENTFLOW_NODE_SCHEDULE.
 */

const fs = require('fs');
const path = require('path');

const REGISTRY = (process.env.AGENTFLOW_NPM_REGISTRY || 'https://registry.npmjs.org').replace(/\/$/, '');
const SCHEDULE = process.env.AGENTFLOW_NODE_SCHEDULE || 'https://raw.githubusercontent.com/nodejs/Release/main/schedule.json';
const SEVERITY = ['info', 'low', 'moderate', 'high', 'critical'];

// --- minimal semver -----------------------------------------------------------
const parse = (v) => {
  const m = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?/.exec(String(v).trim());
  return m ? { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] || null } : null;
};
const cmp = (a, b) => {
  const x = parse(a); const y = parse(b);
  for (const k of ['major', 'minor', 'patch']) if (x[k] !== y[k]) return x[k] - y[k];
  if (x.pre === y.pre) return 0;
  return x.pre ? -1 : 1;
};
const stable = (v) => { const p = parse(v); return !!p && !p.pre; };

// Does `v` satisfy a range like "<4.20.0", ">=2.0.0 <4.20.0", "<1.2.3 || >=2.0.0 <2.1.0"?
// Enough for advisory ranges; not a general semver implementation.
function satisfies(v, range) {
  return String(range).split('||').some((part) => part.trim().split(/\s+/).filter(Boolean).every((c) => {
    const m = /^(<=|>=|<|>|=)?v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/.exec(c);
    if (!m) return c === '*';
    const d = cmp(v, m[2]);
    switch (m[1]) {
      case '<': return d < 0;
      case '<=': return d <= 0;
      case '>': return d > 0;
      case '>=': return d >= 0;
      default: return d === 0;
    }
  }));
}

// The lowest stable version above `installed` that no advisory's range covers.
function smallestSafe(meta, installed, advisoryList) {
  const candidates = Object.keys(meta.versions || {}).filter((v) => stable(v) && cmp(v, installed) > 0).sort(cmp);
  return candidates.find((v) => advisoryList.every((a) => !satisfies(v, a.vulnerable_versions || '*'))) || null;
}

// Highest stable version — the `latest` tag unless it points at a pre-release.
function latestStable(meta) {
  const tagged = meta['dist-tags'] && meta['dist-tags'].latest;
  if (tagged && stable(tagged)) return tagged;
  const all = Object.keys(meta.versions || {}).filter(stable).sort(cmp);
  return all[all.length - 1] || tagged || null;
}

// --- reading the project --------------------------------------------------------
function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

function installedVersions(dir, names) {
  const out = {};
  const lock = readJson(path.join(dir, 'package-lock.json'));
  for (const name of names) {
    const fromLock = lock && ((lock.packages && lock.packages[`node_modules/${name}`]) ||
      (lock.dependencies && lock.dependencies[name]));
    if (fromLock && fromLock.version) { out[name] = { version: fromLock.version, source: 'package-lock.json' }; continue; }
    const mod = readJson(path.join(dir, 'node_modules', name, 'package.json'));
    if (mod && mod.version) { out[name] = { version: mod.version, source: 'node_modules' }; continue; }
    out[name] = { version: null, source: 'range only' };
  }
  return out;
}

function runtimeMajor(dir, pkg) {
  for (const f of ['.nvmrc', '.node-version']) {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) {
      const m = /(\d+)/.exec(fs.readFileSync(p, 'utf8'));
      if (m) return { major: +m[1], source: f };
    }
  }
  const range = pkg.engines && pkg.engines.node;
  const m = range && /(\d+)/.exec(range);
  return m ? { major: +m[1], source: `engines.node "${range}"` } : null;
}

// --- remote data ------------------------------------------------------------------
async function getJson(url, init) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

async function packageMeta(name) {
  return getJson(`${REGISTRY}/${name.replace('/', '%2f')}`, {
    headers: { accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8' },
  });
}

async function advisories(installed) {
  const body = {};
  for (const [name, info] of Object.entries(installed)) if (info.version) body[name] = [info.version];
  if (!Object.keys(body).length) return {};
  return getJson(`${REGISTRY}/-/npm/v1/security/advisories/bulk`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  });
}

// --- the report ---------------------------------------------------------------------
async function report(dir, { prod = false, today = new Date() } = {}) {
  const pkg = readJson(path.join(dir, 'package.json'));
  if (!pkg) throw new Error(`no package.json in ${dir}`);
  const declared = { ...(pkg.dependencies || {}), ...(prod ? {} : pkg.devDependencies || {}) };
  const names = Object.keys(declared).sort();
  const installed = installedVersions(dir, names);
  const errors = [];

  let advisoryMap = {};
  try { advisoryMap = await advisories(installed); } catch (e) { errors.push(`advisories: ${e.message}`); }

  const rows = [];
  for (const name of names) {
    const row = { name, declared: declared[name], ...installed[name], latest: null, triggers: [], fixedIn: null };
    // Keep only advisories whose vulnerable range covers the installed version —
    // never trust the server to have filtered.
    const list = (advisoryMap[name] || []).filter((a) =>
      !row.version || !a.vulnerable_versions || satisfies(row.version, a.vulnerable_versions));
    try {
      const meta = await packageMeta(name);
      row.latest = latestStable(meta);
      const v = row.version && meta.versions && meta.versions[row.version];
      if (v && v.deprecated) row.triggers.push({ kind: 'deprecated', detail: v.deprecated, urgency: 'medium' });
      if (list.length && row.version) {
        row.fixedIn = smallestSafe(meta, row.version, list);
        row.fixSameMajor = !!(row.fixedIn && parse(row.fixedIn).major === parse(row.version).major);
      }
    } catch (e) { errors.push(`${name}: ${e.message}`); }
    const URGENCY = { critical: 'critical', high: 'high', moderate: 'medium', low: 'low', info: 'low' };
    for (const a of list) {
      const sev = SEVERITY.includes(a.severity) ? a.severity : 'moderate';
      row.triggers.push({ kind: 'security', detail: `${a.title} (${a.url})`, severity: sev, urgency: URGENCY[sev] });
    }
    row.available = !!(row.version && row.latest && cmp(row.latest, row.version) > 0);
    row.majorBehind = row.available ? parse(row.latest).major - parse(row.version).major : 0;
    row.recommended = row.triggers.length > 0;
    rows.push(row);
  }

  let runtime = null;
  const rt = runtimeMajor(dir, pkg);
  if (rt) {
    runtime = { name: 'node', major: rt.major, source: rt.source, triggers: [] };
    try {
      const sched = await getJson(SCHEDULE);
      const entry = sched[`v${rt.major}`];
      if (entry) {
        runtime.end = entry.end;
        runtime.lts = !!entry.lts;
        if (new Date(entry.end) < today) {
          runtime.triggers.push({ kind: 'end-of-life', detail: `Node ${rt.major} reached end of life on ${entry.end}`, urgency: 'high' });
        }
      } else {
        runtime.note = `v${rt.major} not in the official schedule`;
      }
    } catch (e) { errors.push(`node schedule: ${e.message}`); }
    runtime.recommended = runtime.triggers.length > 0;
  }

  return { dir, rows, runtime, errors };
}

module.exports = { report, latestStable, smallestSafe, satisfies, cmp, parse };
