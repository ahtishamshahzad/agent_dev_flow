# Multi-Agent Execution Modes

How work is executed across one or more agents. **Default to a single agent.** Add agents only when the work genuinely divides and the coordination cost is justified (`../system/MULTI_AGENT_RULES.md`). Tool-neutral: where an editor spawns sub-agents, the roles run concurrently; where it can't, one agent plays the roles **sequentially**, keeping the separation-of-concerns and independent-review benefits.

> **Do not use multi-agent work only because the capability exists.** The mode is chosen from the shape of the work, not the tooling.

## Mode 1 — Single-agent

One agent carries the work end to end.

- **Use for:** small or tightly-coupled changes; anything where splitting would cost more than it saves; unresolved architecture (you cannot safely divide what isn't defined yet).
- **Why:** no coordination overhead, no conflict risk, full context in one place.
- **Default.** Most work is this.

## Mode 2 — Sequential specialists

One agent (or a chain) plays specialist roles **in order**, handing off between stages:

```
requirements → architecture → implementation → test → review
(product-analyst → architect → engineer(s) → test-engineer → code/security-reviewer)
```

- **Use for:** work that benefits from role separation (e.g. independent review) but does **not** need parallelism — or where an editor can't spawn concurrent agents.
- **Why:** preserves separation of concerns and independent review while avoiding all concurrent-edit risk (only one agent writes at a time).
- Each stage ends with a **handoff** (each agent's Handoff Format) the next stage consumes.

## Mode 3 — Parallel specialists

Multiple agents work **concurrently on independent workstreams**. Permitted **only** when all four conditions below hold; otherwise fall back to Mode 2.

### Required for any parallel run

1. **Non-overlapping file ownership.** The orchestrator produces a file-ownership map where each agent owns a **disjoint** set of files/directories. No file appears under two agents. A file both would change is assigned to **one** owner; the other requests the change through the orchestrator.
2. **Explicit shared contracts.** Interfaces that cross workstreams (API contract, database schema/data-access contract, shared types) are **defined and agreed first**, so no agent must edit another's files to integrate.
3. **Synchronization point.** A defined point where parallel streams rejoin and are reconciled against the contracts.
4. **Final integration review.** A single agent (orchestrator or code-reviewer) reviews the **combined** output end-to-end before handoff — parallel pieces are never shipped un-integrated.

### Typical safe split

- `backend-engineer` (its domain modules) ‖ `database-engineer` (schema/migrations, sole owner) ‖ `web-engineer` (its routes) ‖ `mobile-engineer` (its screens) — each disjoint, all bound by the pre-agreed API/data contracts, rejoined at the sync point, integration-reviewed once.

## How the orchestrator prevents silent conflicts

The orchestrator (`orchestrator.md`) is responsible, before and during any parallel run, for:

- Building and recording the **file-ownership map** in `../projects/current/` — disjoint by construction.
- Defining **shared contracts first**; assigning **one owner per shared/contract file**.
- Refusing to parallelize when scopes cannot be made disjoint (→ Mode 2 instead).
- Holding the **synchronization point** and running the **final integration review**.
- Resolving any cross-scope change request so no agent silently edits another's files.

Two agents editing the same file concurrently is **not allowed** — it is prevented by construction (disjoint ownership), not detected after the fact.

## Choosing a mode (quick guide)

| Situation | Mode |
|---|---|
| Small/coupled change; architecture unresolved | 1 — single-agent |
| Role separation useful, no parallelism needed, or editor can't spawn agents | 2 — sequential specialists |
| Genuinely independent streams, disjoint files, contracts defined | 3 — parallel specialists |
| Scopes can't be made disjoint | **not** parallel → Mode 2 |

## Safe-division checklist (before any split)

- [ ] Each agent's file/module scope is **disjoint**.
- [ ] Cross-stream **contracts defined first**.
- [ ] **Dependency order** respected (no deadlock waits).
- [ ] Each slice has **independent acceptance criteria**.
- [ ] A **synchronization point** is set.
- [ ] A **single agent integrates and validates** the whole.

## Related

- Rules: `../system/MULTI_AGENT_RULES.md`, `../system/ORCHESTRATION_WORKFLOW.md`, `../system/CONTEXT_MANAGEMENT_RULES.md`.
- Agents: `orchestrator.md` (coordinator) and the specialist roles in this folder.
- Workflows that may run parallel streams: `../workflows/` (each names its agents and gates).
