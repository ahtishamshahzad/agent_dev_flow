# Hook: before-refactor

> Tool-neutral checklist run before a refactor begins. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

Before starting a behavior-preserving refactor (refactor workflow — `../workflows/refactor.md`).

## Required Inputs

- The refactor goal and target area; the current behavior it must preserve.
- Existing test coverage of the target (the safety net).

## Checks

- [ ] The refactor is **behavior-preserving** — its goal is structure/clarity, not new behavior (`../skills/refactor-planning`).
- [ ] A **test safety net** exists for the target behavior (or characterization tests are added **first**); coverage assessed by risk (`../skills/testing/test-coverage-audit`).
- [ ] The plan is **small, reversible steps**, each independently verifiable.
- [ ] Scope is bounded; no feature changes smuggled in.

## Failure Conditions

- No test coverage of the behavior being refactored and none added first.
- The "refactor" changes behavior (that's a feature/bugfix, not a refactor).
- One large irreversible step instead of small reversible ones.

## Output

- Confirmation of a preserved-behavior goal, a test safety net, and a small-step plan — recorded for the implementer.

## Stop Conditions

- **Stop** if the target behavior is untested and characterization tests aren't added first.
- **Stop** if the change alters behavior — reclassify as feature/bugfix.
- Otherwise proceed in small reversible steps.

## Related

- Agent: the owning engineer + `../agents/test-engineer.md`. Skill: `../skills/refactor-planning`.
