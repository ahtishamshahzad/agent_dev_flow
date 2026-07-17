# Hook: before-architecture

> Tool-neutral checklist run before architecture work begins. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

Before architecture design starts — i.e. after requirements and after the applications+stack approval gate (`../system/ORCHESTRATION_WORKFLOW.md` stage 7).

## Required Inputs

- Requirements + success criteria (Gate 1 output).
- Application selection + stack recommendation, and the **user approval** for them (Gate 2).

## Checks

- [ ] Gate 1 satisfied: requirements clear, unknowns resolved or explicitly assumed, repo audited if one exists.
- [ ] Applications selected with justification; stack recommended per area; database paired with a data layer (not compared to an ORM).
- [ ] **Gate 2 user approval recorded** in `../projects/current/` — applications + stack approved.
- [ ] No application code has been written yet (no code before the gates).

## Failure Conditions

- Architecture being started without recorded Gate 2 approval.
- Stack decisions incoherent (e.g. database vs ORM comparison) or unjustified.
- Application code already written before approval.

## Output

- Confirmation that requirements + approved apps/stack are in place and architecture may proceed; recorded for the architect.

## Stop Conditions

- **Stop** if Gate 2 approval is not recorded — get explicit user approval first.
- **Stop** if any implementation has begun pre-gate — halt and report.
- Otherwise proceed to architecture (Gate 3).

## Related

- Agent: `../agents/architect.md`. Rules: Gates 2–3 (`../system/QUALITY_GATES.md`), `../system/STACK_DECISION_RULES.md`.
