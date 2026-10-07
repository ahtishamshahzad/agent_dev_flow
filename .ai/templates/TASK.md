# <TASK|FEAT|TECH|DEPLOY>-<NNN> — <title>

> Fill-in template. A concrete, verifiable unit of work with inputs, outputs, and acceptance criteria (`../system/TASK_GENERATION_RULES.md`). IDs, statuses, priorities, estimates: `../system/PROJECT_MANAGEMENT_RULES.md`.

- **Phase:** PHASE-<NN> · **Week:** WEEK-<NN> · **Owner (agent/role):** <>
- **Status:** BACKLOG | PLANNED | READY | IN_PROGRESS | BLOCKED | IN_REVIEW | TESTING | COMPLETED | CANCELLED | CARRIED_FORWARD
- **Priority:** P0 | P1 | P2 | P3 · **Estimate:** XS | S | M | L (split XL) · **Depends on:** <IDs> | none · **Bug:** BUG-<NNN> | —

## Description

<What this task delivers, in one or two sentences.>

## Inputs

- <Approved artifacts, contracts, prior task outputs it depends on>

## Outputs

- <Files/artifacts produced — within the owner's assigned scope>

## Acceptance Criteria

Gherkin scenarios — one behavior each, observable `Then` (`../system/GHERKIN_RULES.md`). The scenario is the criterion.

- **Delivers:** `features/<area>/<behavior>.feature` — "<scenario title>", "<scenario title>" (approved at Gate 2). A task with behavior but no approved scenario is not ready.

```gherkin
Scenario: <single behavior this task delivers>
  Given <context>
  When <action>
  Then <observable outcome>
```

- [ ] Each scenario above passes at the level chosen in the test plan.
- [ ] Required cases covered where applicable, one scenario each: happy · invalid input · error · authorization denial · regression.

## File Ownership (scope)

- **May modify:** <disjoint paths>
- **Must not modify:** <others' scopes / shared contracts owned elsewhere>

## Notes / Risks

- <>

## Related

- Phase: `PHASE_PLAN.md`. Hooks: `../hooks/before-feature.md`, `../hooks/after-feature.md`.
