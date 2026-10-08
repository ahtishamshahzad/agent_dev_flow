# Evaluations

## Validation is not evaluation

| | Repository validation | Effectiveness evaluation |
|---|---|---|
| Question | Is AgentFlow internally consistent? | Does AgentFlow make an AI agent's engineering work better? |
| How | `node scripts/validate.js`, `npm test` — automatic, every PR | A person (or a judging model) scores agent transcripts against fixed properties |
| Passes when | Counts, versions, links, bundle, and token figures match the files | The AgentFlow run beats the baseline on the properties, by a margin larger than run-to-run noise |
| Status | Running in CI | A runner and a first **pilot** (n = 1 per arm — not statistically meaningful) in [`results/`](results/README.md) |

Nothing in this folder claims AgentFlow works. It defines how to find out, and records what was actually run.

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

Each folder holds `input.md` (the case described for a human), `prompt.md` (exactly what the agent receives), optional `setup*/` files, `expected-properties.md` (pass/fail checks), and `evaluation.md` (how to score, and what a failure looks like).

[`workflow-checks/`](workflow-checks/README.md) holds five lifecycle checks (new feature, bug, API change, security change, pure refactor) run with AgentFlow only, against [`fixtures/`](fixtures/README.md).

## How to run a case

```bash
node evals/run.js                              # all six cases, both arms, 1 run each
node evals/run.js --case security --runs 3     # one case, three runs per arm
node evals/run.js --suite workflow-checks      # the five lifecycle checks, AgentFlow arm
```

`run.js` drives Claude Code's headless mode (`claude -p`); other agents can follow the same steps by hand:

1. **Baseline arm:** a fresh project in the OS temp dir with no `.ai/`, no adapters, plus the case's `setup/` and `setup-baseline/` files. Send `prompt.md` verbatim.
2. **AgentFlow arm:** the same, after `agentflow init --editor claude`, plus `setup-agentflow/`. Same agent, same model, same prompt — the prompt never mentions AgentFlow; the adapters must do the work.
3. **Isolation:** user settings excluded (no personal hooks or plugins), read-only tools, no session persistence. Read-only is a deliberate constraint — cases score process and judgment from the transcript — and is reported as a deviation from interactive use.
4. Run each arm **at least 3 times**; models are not deterministic. Transcripts land in `results/raw/<date>-<suite>/` with turns, tokens, cost, and time.
5. Score blind: `node evals/score.js results/raw/<dir> --judge <model>` has a separate model judge each transcript against its properties, with arm-identifying text masked (`.ai/` paths, rule-file names, "AgentFlow", gate numbers) and no arm label — it records pass/fail plus a quote per property in `<id>.score.json`. Masking hides the label, not the style: an AgentFlow answer still tends to stop for approval, so a judge can sometimes infer the arm. `node evals/summarize.js <dirs>` turns scores into per-case, per-arm pass rates with run-to-run spread and the properties that differ. Hand scoring with `SCORESHEET.md` remains valid for spot checks. Record the run in `results/` (format below). Report per-property pass rates per arm, not a single headline number.
6. **Usage limits:** both scripts stop when the agent reports a session or usage limit — a limit message is never recorded as a result — and `--resume` continues from the last good run or score.

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
