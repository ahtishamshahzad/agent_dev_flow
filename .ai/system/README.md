# `.ai/system/` — Core Operating Rules

These files are the **brain** of the AI Engineering System. They are canonical and tool-neutral: every agent reads them regardless of editor. Adapter files must not restate them — they link here.

## Read order

1. **`OPERATING_RULES.md`** — the non-negotiable rules that govern every request.
2. **`ORCHESTRATION_WORKFLOW.md`** — the end-to-end flow from request to release, with gates.
3. **`QUALITY_GATES.md`** — the approval checkpoints; nothing advances past a failed gate.

## Rule files by concern

| Concern | File |
|---|---|
| Global behavior & guardrails | `OPERATING_RULES.md` |
| End-to-end workflow | `ORCHESTRATION_WORKFLOW.md` |
| What applications a project needs | `APPLICATION_SELECTION_RULES.md` |
| Which stack to recommend (per area) | `STACK_DECISION_RULES.md` |
| Which skills to load for a task | `SKILL_SELECTION_RULES.md` |
| How to generate phases dynamically | `PHASE_GENERATION_RULES.md` |
| How to break phases into tasks | `TASK_GENERATION_RULES.md` |
| Layered context loading | `CONTEXT_MANAGEMENT_RULES.md` |
| Token/economy discipline | `TOKEN_OPTIMIZATION_RULES.md` |
| When (and when not) to use multiple agents | `MULTI_AGENT_RULES.md` |
| Tool-neutral workflow gates | `HOOK_RULES.md` |
| Approval checkpoints | `QUALITY_GATES.md` |
| How and where to document | `DOCUMENTATION_RULES.md` |
| Choosing testing tools/levels | `TESTING_SELECTION_RULES.md` |
| Security expectations | `SECURITY_RULES.md` |
| Branching, commits, PRs | `GIT_WORKFLOW_RULES.md` |

## Precedence

When two rules appear to conflict, resolve in this order:
1. Explicit, current **user instruction**.
2. `OPERATING_RULES.md`.
3. The most specific rule file for the concern.
4. General best practice.

Record any resolved conflict in `../memory/` if it will recur.
