---
name: context-engineering
description: Use at the start of any non-trivial task to assemble the minimum sufficient context — scenarios first, then the relevant skills, files, and tests — escalating only on evidence; also to build context packs for multi-step or multi-agent work, keep stable project summaries fresh, and explain why each item was loaded.
---

# Context Engineering

## Purpose

Give the agent exactly the context the task needs to be done correctly — no less (guessing), no more (dilution and cost). Rules: `../../system/CONTEXT_MANAGEMENT_RULES.md` (layers, escalation levels and triggers, relevance check, budgets, stable context, isolation); this skill applies them.

## When to Use

- Starting any task beyond a one-line change.
- Context is growing, or a fact is missing and you're tempted to read broadly.
- Splitting work across agents (each needs a pack).
- A stable project summary may be out of date.
- **Not** for choosing skills by catalogue (`../SKILLS_INDEX.md` does that) — this decides how much to load and in what order.

## Inputs

- The task and its classification.
- `CURRENT_STATUS.md` and the summaries in `../../projects/current/context/`, if present.
- The repository's `features/`, skill index, and file tree — searched, not read wholesale.

## Discovery Questions

- What behavior is this about, and which scenarios describe it?
- Which files *change*, which only *inform*, and which tests prove it?
- What's the smallest level (rules: 1–5) that could be enough?

## Responsibilities

- Set a budget (minimal / small / medium / large) from the task.
- Anchor on Gherkin: find the matching scenarios before reading code.
- Load in order: scenarios → 1–3 skills → affected files and their tests → dependencies → official docs → broad repo, stopping when sufficient.
- Escalate only on a named trigger; record it.
- Keep a reason for every non-global item; produce a context pack when the work spans steps or agents.
- Check stable summaries for staleness before trusting them.

## Required Workflow

1. **Classify and budget** the task.
2. **Check stable context:** `agentflow context check`; re-read and update any stale summary before relying on it.
3. **Suggest a starting set:** `agentflow context suggest "<task in a few words>"` — matching scenarios, skills, files and tests, each with its reason. A starting point to verify, not a substitute for reading.
4. **Read at Level 1–2:** the scenarios, the chosen skills, the affected file(s) and their direct tests — relevant ranges, once.
5. **Escalate on evidence only** (unknown symbol, missing contract, conflicting implementation, failing test, version-specific or security-sensitive behavior), one level at a time, noting the trigger.
6. **Stop when** you can state the change, its tests, and its risks with nothing unexplained — then work.
7. **Record** a context pack (`../../templates/CONTEXT_PACK.md`) for multi-step or multi-agent work.

## Decision Rules

- Relevant beats complete; a targeted search beats a directory read.
- No reason → don't load it.
- Uncertain → retrieve, don't guess; still uncertain → ask or report it.
- Compress only what correctness doesn't depend on; never summarize away a contract, invariant, version, or security rule.
- Parallel agents share one baseline and contract; their packs differ only by task.

## Rules

- Never load all skills, all features, or the whole repository by default.
- Never re-read a file or repeat a search already done in this task.
- Never claim token savings without measurement; report "unknown" where usage isn't exposed.

## Anti-Patterns

- Coding from the request with no scenario or file read.
- "Let me read the whole codebase first."
- Loading every skill "to be safe".
- Trusting a project summary written before the last dependency upgrade.
- Giving every parallel agent the full repository.
- A one-line answer that hides a failed check to look efficient.

## Validation Checklist

- [ ] Budget set; level reached and the triggers for each escalation noted.
- [ ] Scenarios found (or the missing one written) before code was read.
- [ ] Every non-global item has a reason.
- [ ] No stale summary relied on.
- [ ] Nothing correctness needs was left out to save context.

## Definition of Done

The task was understood, changed, and validated from a context set you can justify item by item — and anything still unknown is stated.

## Related Skills

`testing/gherkin-specifications` (the anchor), `technology-governance` (Level 5 and stack facts), `project-orchestrator`, `project-management`, `existing-project-audit`.

## Related Knowledge

`../../projects/current/context/` (stable summaries).

## Related References

`../../templates/CONTEXT_PACK.md`, `../../templates/PROJECT_CONTEXT.md` · examples: `examples/context-engineering/` in the AgentFlow repository.

## Context Loading Guidance

- **Requires:** the task, the rules file, `CURRENT_STATUS.md`.
- **Does not require:** anything else up front — that's the point.
- **May load:** whatever the escalation steps justify.
- **Stop when:** the context is sufficient and recorded.

## Token Efficiency Guidance

This skill is the token-efficiency guidance. Keep its own footprint small: use the CLI suggestions, read ranges, and write packs as short lists with reasons.
