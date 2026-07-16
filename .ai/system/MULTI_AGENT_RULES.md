# Multi-Agent Rules

Multi-agent execution is **optional**. Default to a single agent. Add agents only when the work genuinely divides and the coordination cost is justified.

## Use multiple agents when

- Work can be **divided safely** into independent slices.
- **Responsibilities are clearly separated** (distinct files/modules/concerns).
- **Outputs can be reviewed independently.**
- **Parallel execution meaningfully reduces time.**
- **Security or testing benefits from independent review** (e.g. a reviewer agent separate from the implementer).

## Do NOT use multiple agents when

- The change is **small**.
- Agents would **edit the same files**.
- **Architecture is unresolved.**
- **Dependency ordering is unclear.**
- **Coordination cost exceeds the benefit.**

## Orchestrator responsibilities

The orchestrator (lead agent) remains responsible for:
- **Assigning tasks** to agents with clear scope.
- **Preventing conflicting edits** (no two agents on the same files concurrently).
- **Defining inputs and outputs** for each agent.
- **Collecting results.**
- **Resolving disagreements** between agents.
- **Running final validation** across the combined output.

## Safe division checklist

Before splitting work, confirm:
- [ ] Each agent's file/module scope is disjoint.
- [ ] Interfaces/contracts between slices are defined first.
- [ ] Dependency order is respected (no agent waits on another mid-flight in a way that deadlocks).
- [ ] Each slice has independent acceptance criteria.
- [ ] A single agent will integrate and validate the whole.

## Agent roles (optional)

Role definitions live in `../agents/` and are used only for multi-agent runs. Common roles: orchestrator, implementer, reviewer, tester, security reviewer. Assign each a focused skill set (`SKILL_SELECTION_RULES.md`).

## Tool neutrality

Not every editor supports spawning sub-agents. Where it does (e.g. Claude Code subagents), use it under these rules. Where it doesn't, the same division can be run sequentially by one agent, preserving the separation-of-concerns and independent-review benefits.
