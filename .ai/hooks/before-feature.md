# Hook: before-feature

> Tool-neutral checklist run before feature implementation begins. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

Before starting implementation of a feature/task (`../system/ORCHESTRATION_WORKFLOW.md` stage 11).

## Required Inputs

- Approved architecture (Gate 3) and approved phases+tasks with acceptance criteria (Gate 4).
- The feature's scope, the skills selected for it, and — if multi-agent — the file-ownership map.

## Checks

- [ ] **Gate 4 approval recorded**: phases/tasks generated, acceptance criteria defined, user approved.
- [ ] The feature fits the approved architecture (no unresolved design).
- [ ] Only the relevant skills are loaded (`../system/SKILL_SELECTION_RULES.md`); scope is bounded (no creep).
- [ ] If parallel: this agent's file scope is **disjoint** from others; shared contracts are defined first (`../agents/multi-agent-execution.md`).
- [ ] Test approach for the required cases is known (happy, invalid input, error, authorization denial, regression).

## Failure Conditions

- Implementation starting without Gate 4 approval.
- Scope exceeds the approved tasks, or architecture is unresolved.
- Parallel work with overlapping file ownership or undefined contracts.

## Output

- Confirmation the feature is approved, scoped, skill-loaded, and (if parallel) conflict-free — recorded for the implementer.

## Stop Conditions

- **Stop** if Gate 4 is not approved, or scope/architecture is unresolved.
- **Stop** if parallel scopes overlap — make them disjoint or run sequentially (`../agents/multi-agent-execution.md`).
- Otherwise proceed to implementation.

## Related

- Agents: `../agents/backend-engineer.md`, `../agents/web-engineer.md`, `../agents/mobile-engineer.md`, `../agents/database-engineer.md`, `../agents/test-engineer.md`. Rule: Gate 4.
