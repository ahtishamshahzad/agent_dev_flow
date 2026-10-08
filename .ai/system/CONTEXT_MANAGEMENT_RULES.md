# Context Management Rules — Context Engineering

> **Context is an engineering resource. Retrieve the minimum sufficient context, expand only when evidence requires it, and never trade correctness for token savings.**

**Minimum sufficient context** is the smallest set of information that lets the agent correctly understand, implement, test, and validate the task. More context is not better; *relevant* context is. Both failures are real: too little (coding straight from the request → wrong assumptions, duplicate implementations, architecture violations, regressions) and too much (loading the repository, every skill, every document → cost, slowness, diluted attention). Applied by `../skills/context-engineering`; economy habits in `TOKEN_OPTIMIZATION_RULES.md`.

## Priority order

Correctness · security · requirements · existing architecture · testing · maintainability · **then** token efficiency. Efficiency never overrides the six above it.

## What to load, in layers

| Layer | Contents | When |
|---|---|---|
| 0 · Task | The request, its classification, scope, constraints | Always |
| 1 · Global | `../../AGENTS.md`, `OPERATING_RULES.md`, `ORCHESTRATION_WORKFLOW.md`, the project's `CURRENT_STATUS.md` and stable context summaries (§Stable project context) | Always — kept short |
| 2 · Task-specific | The matching Gherkin scenarios, the 1–3 relevant skills (via `../skills/SKILLS_INDEX.md`), the affected files and their tests, the relevant slice of architecture and configuration | Per task |
| 3 · Dependency | Imported and importing modules, shared services, schema, API contracts, integration code | When layer 2 points at them |
| 4 · External | Official documentation, version research (`TECHNOLOGY_GOVERNANCE_RULES.md`) | When behavior is version-specific or not in the repo |
| 5 · Broad repository | Cross-module structure | Only when 2–4 are insufficient |

Planning work loads the pipeline records in the same spirit: project → active phase → work item → task, as deep as the task needs.

## Escalation — evidence first

Start at **Level 1** and move up only on a trigger:

| Level | Adds | Typical task |
|---|---|---|
| 1 Minimal | Task + global rules + the relevant scenarios | Rename, copy change, config value |
| 2 Local | The affected files + their direct tests | Most bug fixes |
| 3 Related | Related modules, architecture slice, dependencies | Features, cross-file bugs |
| 4 System | Broader repository, cross-module dependencies | Migrations, architecture changes |
| 5 External | Official docs, version research | Version-sensitive or undocumented behavior |

**Valid triggers:** an unknown symbol or dependency · unclear architecture · a missing API contract or data relationship · conflicting implementations · an unexpected test failure · version-specific behavior · security-sensitive behavior · a cross-module dependency. **Not a trigger:** "to understand the whole repository". Try a targeted search first.

**File retrieval grows stepwise:** the relevant file → its direct dependencies and tests → related files → the module. Roughly *1 → 3 → 8 → module*, never "read the directory". Search once, read the relevant range, reuse the result — don't re-read a file or re-run a search already done in this task.

## Relevance check and explanation

Before loading any non-global item, have a reason: *understand the behavior · modify it · test it · compatibility · security · architecture · release*. No reason, no load. Be able to say, for any item, **why it was loaded** — "`notify.ts`: called by the failing test and named in the regression scenario" — and **why context escalated**. For multi-step or multi-agent work, record this as a context pack (`../templates/CONTEXT_PACK.md`).

**Gherkin is the strongest anchor:** find the scenarios that match the task first; they name the behavior, which names the code. A bug without a regression scenario gets one (`GHERKIN_RULES.md`). Unrelated feature files are not loaded.

## Budgets adapt to the task

Semantic, not numeric: **minimal** (rename, copy) · **small** (local bug) · **medium** (feature, auth bug) · **large** (subsystem, migration) · **large with guardrails** (architecture change — escalate deliberately, record why). A budget is a ceiling to justify crossing, not a quota to fill.

## Don't repeat, compress carefully

- `.ai/` is canonical; adapters, READMEs, and skills reference it instead of restating it.
- Large documents get a compact summary for routine use; the original stays available for deeper reads. **Never compress away what correctness needs** — contracts, invariants, security rules, versions.
- Output is part of the budget: report changes, tests, and validation concisely — but never drop an error, assumption, risk, or failed check to save space.

## Stable project context

Facts that rarely change — project, technology, architecture, testing, security — live as short summaries in `../projects/current/context/` (`../templates/PROJECT_CONTEXT.md`). Each declares the source files it summarizes (`sources:`) and a fingerprint of them. **Never trust a stale summary:** `agentflow context check` reports summaries whose sources changed (manifests, lock files, schema, configuration, architecture docs); re-read the sources, update the summary, then `agentflow context check --update`.

## When context is insufficient

Don't guess. Detect the uncertainty → name what is missing → retrieve it (escalate) → continue. If it still can't be resolved, ask, or report the open question plainly. Never fill a gap with invented facts to save a lookup (`OPERATING_RULES.md` §8: search before claiming absence).

## Multi-agent isolation

Every agent gets the same **shared baseline** — global rules, the approved scenarios, the architecture and API contracts, the scope — plus **its own task-specific pack** and file ownership. Not the whole repository. If a shared contract changes: stop the affected agents, update the contract, refresh their packs, continue (`MULTI_AGENT_RULES.md`).

## Measuring

Token data is reported only where the tool exposes it (otherwise "unknown"). Useful measures — always next to task quality, never alone: **retrieval efficiency** (relevant files ÷ files read), tool calls, repeated reads, escalations, tokens, cost, and whether the task was done right. A smaller context that gets the task wrong is not efficient. `evals/` measures these (`evals/README.md`).

## When context is getting large

Write a concise summary of decisions to `../projects/current/`, then continue from it. Drop raw file contents when switching tasks; carry forward decisions. Archive finished reports in `../generated/`.
