# Evaluations

## Validation is not evaluation

| | Repository validation | Effectiveness evaluation |
|---|---|---|
| Question | Is AgentFlow internally consistent? | Does AgentFlow make an AI agent's engineering work better? |
| How | `node scripts/validate.js`, `npm test` — automatic, every PR | A person (or a judging model) scores agent transcripts against fixed properties |
| Passes when | Counts, versions, links, bundle, and token figures match the files | The AgentFlow run beats the baseline on the properties, by a margin larger than run-to-run noise |
| Status | Running in CI | **Methodology and cases only. No results have been recorded yet.** |

Nothing in this folder claims AgentFlow works. It defines how to find out.

## What is measured

Each case lists observable **properties** of a good response. They group into:

| Property | Failure it catches |
|---|---|
| Requirements coverage | Stated requirements missing from the plan |
| Assumptions surfaced | Gaps silently filled with guesses |
| Gate discipline | Code written, dependencies installed, or a stack chosen before approval |
| Architecture completeness | Tenancy, auth, error handling, config left undecided |
| Security findings | Known-planted weaknesses not found; findings without location; "it's secure" |
| Testing completeness | No authorization-denial or regression test; coverage-chasing instead of risk |
| Scope control | New requirements absorbed without a `SCOPE CHANGE` |
| Verification discipline | "Done" or "tests pass" without evidence |
| Hallucinated claims | Invented files, APIs, results, or completed work |

## Cases

| Category | Case | Input |
|---|---|---|
| [`planning/`](planning/) | Plan a small multi-tenant app from a one-paragraph request | Request text |
| [`architecture/`](architecture/) | Choose tenancy isolation and justify it | Requirements excerpt |
| [`bug-fixing/`](bug-fixing/) | A reported bug whose symptom points away from the cause | Bug report + code excerpt |
| [`security/`](security/) | Review a change with three planted weaknesses | Diff |
| [`testing/`](testing/) | Write the test plan for an endpoint | Endpoint spec |
| [`scope-control/`](scope-control/) | A new requirement arrives mid-implementation | Approved plan + new request |

Each folder holds `input.md` (exactly what the agent receives), `expected-properties.md` (pass/fail checks), and `evaluation.md` (how to score, and what a failure looks like).

## How to run a case

1. **Baseline arm:** a fresh repository with no `.ai/`, no adapters. Give the agent `input.md` verbatim.
2. **AgentFlow arm:** the same repository after `npx github:ahtishamshahzad/agent_dev_flow init`. Same agent, same model, same input. Do not mention AgentFlow in the prompt — the adapters must do the work.
3. Run each arm **at least 3 times** in fresh sessions; models are not deterministic.
4. Save each transcript. Score every property pass/fail with `SCORESHEET.md`, **blind to the arm** where possible (strip `.ai/` paths from the transcript first).
5. Record the run in `results/` (format below). Report per-property pass rates per arm, not a single headline number.

## What counts as success

For a property, AgentFlow **helps** when its pass rate is higher than the baseline's in every run batch and the difference is larger than the spread between runs of the same arm. It **hurts** when lower. Otherwise: no measured difference — which is a valid result and gets recorded too.

Report token cost and wall time per arm alongside: an improvement that costs ten times the tokens is a trade-off, not a win.

## Recording results

`results/<YYYY-MM-DD>-<agent>-<model>.md`: agent and model with versions, AgentFlow version (`.ai/VERSION`), runs per arm, the filled scoresheets, per-property pass rates, token and time per arm, and anything that deviated from this procedure. **Never record a result that was not run, and never edit a result after the fact** — add a dated note instead.

## Add a case

Copy a category folder's three files. A good case:

- has an input a real user would send, with no hint of the expected answer;
- has 4–8 properties, each checkable from the transcript alone, pass/fail;
- includes at least one trap (a planted weakness, a misleading symptom, a scope creep) so the properties can actually fail;
- does not depend on one specific stack unless the case is about choosing one.
