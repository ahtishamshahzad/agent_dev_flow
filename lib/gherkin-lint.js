'use strict';

/**
 * Gherkin linter for the AgentFlow behavior contract (.ai/system/GHERKIN_RULES.md).
 * Zero dependencies. Checks the contract's MUST rules as errors and a few SHOULD
 * rules as warnings. It checks structure, not meaning: a file that passes is
 * well-formed, not necessarily a good specification.
 *
 *   lint(text, fileName) -> [{ line, level: 'error' | 'warning', message }]
 */

const path = require('path');

const STEP = /^(Given|When|Then|And|But|Or|\*)\s+\S/;
const TAG = /^@[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEBAB_FILE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.feature$/;
const ORDER = { Given: 0, When: 1, Then: 2 };

function lint(text, fileName = 'unknown.feature') {
  const out = [];
  const err = (line, message) => out.push({ line, level: 'error', message });
  const warn = (line, message) => out.push({ line, level: 'warning', message });

  if (!KEBAB_FILE.test(path.basename(fileName))) {
    err(1, `file name "${path.basename(fileName)}" must be kebab-case and end in .feature`);
  }

  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  let feature = null;           // line of the Feature
  let block = null;             // current Background / Scenario / Outline
  let sawScenario = false;
  let backgrounds = 0;
  let inDocString = null;       // the delimiter while inside a doc string
  let pendingBlank = false;     // a blank line seen inside a block's steps
  const titles = new Map();

  const closeBlock = () => {
    if (!block) return;
    const b = block;
    if (!b.steps.length) err(b.line, `${b.kind} "${b.title}" has no steps`);
    if (b.kind === 'Background') {
      if (b.phases.has('When') || b.phases.has('Then')) err(b.line, 'Background may only contain Given steps');
    } else if (b.steps.length) {
      if (!b.phases.has('When')) err(b.line, `${b.kind} "${b.title}" has no When step`);
      if (!b.phases.has('Then')) err(b.line, `${b.kind} "${b.title}" has no Then step`);
      if (b.steps.length > 10) warn(b.line, `${b.kind} "${b.title}" has ${b.steps.length} steps — split it or use a table`);
    }
    if (b.kind === 'Scenario Outline') {
      if (!b.examples.length) err(b.line, `Scenario Outline "${b.title}" has no Examples`);
      for (const ex of b.examples) {
        if (!ex.header) err(ex.line, 'Examples has no table');
        else if (!ex.rows) err(ex.line, 'Examples table has a header but no rows');
      }
      const headers = new Set(b.examples.flatMap((ex) => ex.header || []));
      for (const s of b.steps) {
        for (const [, name] of s.text.matchAll(/<([^>]+)>/g)) {
          if (b.examples.length && !headers.has(name)) err(s.line, `placeholder <${name}> is not a column in Examples`);
        }
      }
    }
    block = null;
  };

  const expectIndent = (n, indent, want, what) => {
    if (indent !== want) err(n, `${what} must be indented ${want} spaces (found ${indent})`);
  };

  lines.forEach((raw, i) => {
    const n = i + 1;
    const line = raw.replace(/\s+$/, '');
    const indent = line.length - line.trimStart().length;
    const t = line.trim();

    if (raw.includes('\t')) err(n, 'use spaces, not tabs');
    if (line.length > 120) warn(n, `line is ${line.length} characters (keep under 120)`);

    // Doc strings: everything until the closing delimiter is payload.
    if (inDocString) {
      if (t === inDocString) inDocString = null;
      return;
    }
    if (t === '"""' || t === '```') {
      if (!block || !block.steps.length) err(n, 'doc string must follow a step');
      inDocString = t;
      return;
    }

    if (!t) {
      if (block && block.steps.length && !block.inExamples) pendingBlank = true;
      return;
    }
    if (t.startsWith('#')) {
      if (!/^#\s*language:/.test(t)) warn(n, 'avoid comments — the scenario text is the explanation');
      return;
    }

    if (t.startsWith('@')) {
      for (const tag of t.split(/\s+/)) {
        if (!TAG.test(tag)) err(n, `tag "${tag}" must be @kebab-case`);
      }
      return;
    }

    const kw = /^(Feature|Background|Scenario Outline|Scenario Template|Scenario|Example|Examples|Scenarios|Rule):(.*)$/.exec(t);
    if (kw) {
      const [, word, rest] = kw;
      const title = rest.trim();
      pendingBlank = false;

      if (word === 'Feature') {
        if (feature) { err(n, 'only one Feature per file'); return; }
        feature = n;
        expectIndent(n, indent, 0, 'Feature');
        if (!title) err(n, 'Feature needs a title');
        return;
      }
      if (!feature) { err(n, `${word} before Feature`); return; }
      if (word === 'Rule') { err(n, 'Rule is not part of the AgentFlow contract — split behavior areas into separate feature files'); return; }

      if (word === 'Examples' || word === 'Scenarios') {
        if (!block || block.kind !== 'Scenario Outline') { err(n, 'Examples belongs only under a Scenario Outline'); return; }
        expectIndent(n, indent, 4, 'Examples');
        block.examples.push({ line: n, header: null, rows: 0 });
        block.inExamples = true;
        return;
      }

      closeBlock();
      if (word === 'Background') {
        backgrounds++;
        if (backgrounds > 1) err(n, 'only one Background per Feature');
        if (sawScenario) err(n, 'Background must come before the first Scenario');
        expectIndent(n, indent, 2, 'Background');
        block = { kind: 'Background', title: 'Background', line: n, steps: [], phases: new Set(), last: -1, examples: [] };
        return;
      }

      sawScenario = true;
      const kind = /Outline|Template/.test(word) ? 'Scenario Outline' : 'Scenario';
      expectIndent(n, indent, 2, kind);
      if (!title) err(n, `${kind} needs a title`);
      else if (titles.has(title)) err(n, `duplicate scenario title (also line ${titles.get(title)})`);
      else titles.set(title, n);
      block = { kind, title: title || '(untitled)', line: n, steps: [], phases: new Set(), last: -1, examples: [] };
      return;
    }

    if (t.startsWith('|')) {
      if (!block) { err(n, 'table outside a scenario'); return; }
      if (block.inExamples) {
        const ex = block.examples[block.examples.length - 1];
        expectIndent(n, indent, 6, 'Examples table');
        if (!ex.header) ex.header = t.split('|').slice(1, -1).map((c) => c.trim());
        else ex.rows++;
      } else if (!block.steps.length) {
        err(n, 'data table must follow a step');
      } else {
        expectIndent(n, indent, 6, 'step table');
      }
      return;
    }

    const step = STEP.exec(t);
    if (step) {
      if (!block) { err(n, 'step outside a Scenario or Background'); return; }
      if (block.inExamples) { err(n, 'step after Examples — start a new scenario'); return; }
      expectIndent(n, indent, 4, 'step');
      if (pendingBlank) err(n, 'no blank lines between steps');
      pendingBlank = false;
      const word = step[1];
      if (word === 'Or') { err(n, '"Or" is not allowed — use separate scenarios or a Scenario Outline'); return; }
      if (word === '*') { err(n, 'use Given/When/Then/And/But, not "*"'); return; }
      let phase = word;
      if (word === 'And' || word === 'But') {
        if (block.last < 0) { err(n, `"${word}" cannot start a ${block.kind}`); return; }
        phase = Object.keys(ORDER).find((k) => ORDER[k] === block.last);
      } else {
        if (ORDER[phase] < block.last) err(n, `"${word}" after ${Object.keys(ORDER)[block.last]} — keep strict Given → When → Then`);
        else if (ORDER[phase] === block.last) err(n, `repeated "${word}" — continue with "And", or write a separate scenario`);
      }
      block.last = Math.max(block.last, ORDER[phase]);
      block.phases.add(phase);
      block.steps.push({ line: n, text: t });
      return;
    }

    // Free text: allowed as a description under Feature or a scenario title,
    // before any steps. Anything else is a malformed step.
    if (block && block.steps.length) {
      err(n, `not a step: "${t.slice(0, 40)}" — steps start with Given, When, Then, And, or But`);
    } else if (!feature) {
      err(n, `text before Feature: "${t.slice(0, 40)}"`);
    }
  });

  if (inDocString) err(lines.length, 'doc string is not closed');
  closeBlock();
  if (!feature) err(1, 'no Feature found');
  else if (!sawScenario) err(feature, 'Feature has no scenarios');

  return out.sort((a, b) => a.line - b.line);
}

module.exports = { lint };
