# `context/` — Stable project summaries

Short, factual summaries of what rarely changes — `project.md`, `technology.md`, `architecture.md`, `testing.md`, `security.md` — read at the start of every task instead of the larger sources they summarize (`../../../system/CONTEXT_MANAGEMENT_RULES.md` §Stable project context).

- One file per topic, from `../../../templates/PROJECT_CONTEXT.md`. Each lists its `sources:`.
- `agentflow context check` reports any summary whose sources changed since it was written; re-read the sources, update it, then `agentflow context check --update`.
- Create a summary only when it has something true to say. Never compress away a contract, invariant, version, or security rule.

_No summaries yet._
