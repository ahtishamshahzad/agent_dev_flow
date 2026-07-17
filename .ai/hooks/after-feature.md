# Hook: after-feature

> Tool-neutral checklist run after a feature is implemented. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

After a feature/task's implementation completes, before it is considered done.

## Required Inputs

- The completed change, its acceptance criteria, and its test/review outputs.

## Checks

- [ ] Acceptance criteria met; the feature does what was approved (no scope drift, no false completion — `../skills/ai-output-review`).
- [ ] Required cases covered and passing (happy, invalid input, error, **authorization denial**, regression).
- [ ] Docs/notes updated for the change (`../agents/documentation-engineer.md`).
- [ ] Work item / `../projects/current/` state updated (stage, what's done, what's next).
- [ ] If multi-agent: this slice's output is ready for the synchronization point and integration review.

## Failure Conditions

- Acceptance criteria unmet, or completion overstated.
- Missing required-case coverage.
- State/docs left stale.

## Output

- Confirmation the feature is genuinely complete, tested, documented, and state-updated — ready for review/integration.

## Stop Conditions

- **Stop** (not done) if acceptance criteria are unmet or required cases are uncovered.
- Otherwise mark the feature ready for review/integration and update state.

## Related

- Agents: implementer + `../agents/test-engineer.md`, `../agents/documentation-engineer.md`. Rule: Gate 5.
