# Pilot run — 2026-10-07 · Claude Code 2.1.292 · claude-opus-5-5 · AgentFlow 1.4.0

> **A pilot, not a benchmark.** One run per arm per case (n = 1): a single difference can be noise. Scored by the agent that built AgentFlow — **not blind**, and an interested party. Treat every number here as a reason to run more, not as a conclusion.

- **Runner:** `node evals/run.js` (both suites). Fresh temp project per run, user settings excluded, read-only tools (Read, Glob, Grep), no session persistence.
- **Deviation from interactive use:** agents could not write files or run commands, so "recorded the bug" or "logged the change" is scored from what the transcript states it would record, and no test was ever run in any arm.
- **Transcripts:** `raw/2026-10-07-cases/`, `raw/2026-10-07-workflow-checks/`, `raw/2026-10-07-workflow-checks-rerun/`. Every score below quotes or points to its transcript.

## Comparison cases — baseline vs AgentFlow

| Case | Baseline | AgentFlow | Properties that differed |
|---|---|---|---|
| planning | 5/7 | 7/7 | **P3** assumptions listed separately (AF: "What I'll assume unless you say otherwise"; baseline: none). **P4** an application deferred (AF: "Not in the first version: a marketing website…"; baseline: none deferred) |
| architecture | 7/7 | 7/7 | None — both chose shared schema + RLS, weighed 200 tenants × team of two, and refused to promise physical separation |
| bug-fixing | 5/7 | 6/7 | **P5** regression test first (AF: three regression scenarios incl. "Two payment requests at the same time charge only once"; baseline: no test). **P6** both fail — neither stated a P0/P1 priority (AF tagged `@critical` only) |
| security | 6/7 | 7/7 | **P6** confirmed vs potential (AF labels each, e.g. "(confirmed)", "Potential (I can't see where notes are rendered)"; baseline does not separate them) |
| testing | 6/7 | 7/7 | **P6** test level named with reasons (AF: "API / integration (real database) … the main suite", unit for the role rule, "no UI is in scope, so no component or E2E tests"; baseline never names a level). Both covered cross-project access, last-admin self-demotion, and concurrent demotion |
| **Total** | **34/41** | **40/41** | |
| scope-control | 5/6 | 6/6 | **P6** recorded (AF assigns FEAT-015/FEAT-016 and plans a `SCOPE CHANGE` entry; baseline only offers to add them to `PLAN.md`) |

**Where both arms were already good:** finding the race condition and its correct fix; all three planted security weaknesses; refusing to absorb the scope change; the architecture trade-off. The baseline model is strong — AgentFlow's measured differences in this pilot are in **process discipline** (stated assumptions, deferral, regression-first, confirmed-vs-potential, recording), not in technical findings.

## Cost

| | Baseline | AgentFlow | Ratio |
|---|---|---|---|
| Mean cost per run (6 cases) | $0.098 | $0.313 | ~3.2× |
| Mean turns | 2.0 | 10.7 | — |
| Mean wall time | 24 s | 57 s | ~2.4× |

The extra turns are the agent reading `.ai/` rules before answering. Whether the process gains are worth ~3× the cost per request is the question a larger run should answer.

## Workflow checks — AgentFlow only (behavior-first lifecycle)

| Check | Score | Notes |
|---|---|---|
| password-reset | 5/5 | Stopped at Gate 2 with nine scenarios: expired, used-twice, unrecognised link, no account enumeration, superseded link; no code |
| duplicate-notifications | 5/5 | Root cause `src/app.js:27-28` + listener `sendOnStatusChange.js:9`; regression scenario `@regression @bug-001` "should fail with 2 emails"; "I haven't run it … treat that as unverified" |
| pagination | 5/5 | Default size, last page, `Scenario Outline` for 0/101/"ten", malformed cursor; flagged the bare-array → envelope change as breaking; stopped for approval |
| tenant-isolation | 4/5, 5/5, 5/5 (3 runs) | **Run 1 failed P1**: claimed "the workspace has no application" — the fixture was present (re-runs record the file list); the agent did not search. Re-runs found `GET /projects/:id` (`src/app.js:18`), and one also found an unplanted cross-company write on `PATCH /orders/:id/status` |
| rename-service | 4/4 | "Nothing users can see changes … no new Gherkin scenarios are needed"; skipped the gates; listed every reference |

## What this pilot says — and doesn't

- It does **not** show AgentFlow makes agents better in general: n = 1, unblinded, scored by its author, one model.
- It does show the behavior-first lifecycle is **followed** by this model when installed: scenarios before design, approval stops, regression scenarios, no Gherkin for a rename.
- One real failure worth fixing: the agent once asserted the project was empty without searching it.
- Next: ≥ 3 runs per arm, a blind scorer (strip `.ai/` paths, shuffle arms), and a second model.
