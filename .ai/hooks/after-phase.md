# Hook: after-phase

> Tool-neutral checklist run at the end of a phase. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

After all tasks in a phase are complete, before moving to the next phase.

## Required Inputs

- The phase's tasks and their acceptance criteria; the aggregated outputs.

## Checks

- [ ] Every task in the phase met its acceptance criteria (or exceptions recorded).
- [ ] Cross-task integration verified — the phase's pieces work together (integration review if the phase ran parallel streams — `../agents/multi-agent-execution.md`).
- [ ] Tests for the phase pass (or unrun flagged); no critical/high review/security issue left open.
- [ ] Docs, indexes, changelog, and `../projects/current/` state updated for the phase.
- [ ] Stale reports archived (`../skills/documentation`); `../generated/` tidy.

## Failure Conditions

- Unfinished tasks or unmet acceptance criteria carried silently forward.
- Phase pieces not integrated/verified together.
- State/docs stale; open critical/high issues.

## Output

- A phase-completion record: what shipped, test/review status, state updated, ready for the next phase.

## Stop Conditions

- **Stop** if any task is incomplete or the phase isn't integrated — resolve before advancing.
- Otherwise record completion and proceed to the next phase.

## Related

- Agents: `../agents/orchestrator.md`, `../agents/documentation-engineer.md`. Rules: `../system/PHASE_GENERATION_RULES.md`, gates as applicable.
