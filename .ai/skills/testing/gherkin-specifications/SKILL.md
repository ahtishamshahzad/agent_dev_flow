---
name: gherkin-specifications
description: Use to write and review behavior specifications as Gherkin scenarios — acceptance criteria, required cases, and *.feature files — so one behavior per scenario, domain-level steps, and observable outcomes. Applies the canonical contract in system/GHERKIN_RULES.md; a Cucumber-family runner is a stack decision, the scenario format is not optional.
---

# Gherkin Specifications

## Purpose

Turn a behavior into a **concrete example a stakeholder can read and an agent can execute**. Scenarios written here are the acceptance criteria at Gate 4 and the required-case list at Gate 5 — the same text, not a restatement. The contract they must satisfy is canonical in `../../../system/GHERKIN_RULES.md`; this skill is how it is applied, reviewed, and kept alive.

Format only — *which* levels and tools run the scenarios is `testing-selection` and `../../testing-strategy`.

## When to Use

- Writing **acceptance criteria** for a feature, task, bug, or refactor's behavior guarantee.
- Defining the **required cases** on a critical behavior (happy · invalid input · error · authorization denial · regression · environment validation).
- Authoring or reviewing **`*.feature` files** when the approved stack includes a Cucumber-family runner.
- Reviewing scenarios that have drifted into UI scripts, or that assert "it works".
- **Not** for choosing test levels/tools (`testing-selection`), and not a reason to add a BDD runner to a project that never asked for one (`../../../system/STACK_DECISION_RULES.md`).

## Inputs

- The behavior being specified, and the actors and states it involves.
- The work item (`../../../templates/FEATURE.md`, `TASK.md`, `BUG.md`) whose acceptance criteria these scenarios become.
- The approved stack and existing test framework — what will execute the scenarios.
- The project's existing vocabulary, if scenarios already exist.

## Discovery Questions

- What is the **one behavior** this scenario specifies, and who is the actor?
- What makes the outcome **observable** — what changes, what does the user see, what does the system report?
- Which preconditions does a reader genuinely need, and which are setup noise?
- Is the project running a Cucumber-family runner, or do scenarios live in the work item and map to the existing framework?
- What terms does this product already use for these roles, objects, and states?

## Responsibilities

- Write scenarios that satisfy `../../../system/GHERKIN_RULES.md` — one behavior, independent, domain-level steps, strict Given/When/Then, observable `Then`.
- Cover the **required cases** as separate scenarios; never bundle a denial or an error path into the happy-path scenario.
- Keep one **stable vocabulary** across every feature file and work item in the project.
- Use **concrete, realistic** example data; reserve placeholders for scenarios about invalid or nonsensical input.
- Map each scenario to exactly one executable test at the level `testing-selection` chose — a Cucumber step definition, or a named test case in Jest/Vitest/Supertest/Playwright/Maestro.
- Keep implementation detail in the step definitions, never in the step text.
- Update scenarios when behavior changes — a scenario that no longer matches the product is worse than none.

## Required Workflow

1. State the behavior area and write the `Feature:` title plus its user story.
2. Identify the actors, the starting states, and the observable outcomes.
3. Write the happy-path scenario first — the shortest complete example.
4. Add one scenario per remaining required case (invalid input, error, authorization denial, environment validation; regression when fixing a bug).
5. Collapse only genuine input variations of the *same* behavior into a `Scenario Outline`.
6. Review against the checklist in `../../../system/GHERKIN_RULES.md`.
7. Map each scenario to its test at the chosen level; record which are automated and which stay documentation for now.

## Decision Rules

- **One behavior per scenario.** Two `When`s, or a second concern, means two scenarios.
- **State over navigation** unless the navigation path is the behavior being specified.
- **`Scenario` over `Scenario Outline`** unless the inputs materially vary the same behavior.
- **Domain language over plumbing** — endpoints, SQL, and selectors appear only when the behavior lives at that layer.
- **The scenario is the acceptance criterion.** If planning and tests disagree, the approved scenario wins and the test is corrected.
- **No new BDD dependency without a stack decision** — the format applies regardless of runner.

## Rules

- Steps are third person, present tense, subject–predicate; string parameters in double quotes.
- No `Or` keyword; no repeated Given/When/Then phase inside one scenario.
- No blank lines between steps; one blank line between scenarios; 2-space indentation.
- `*.feature` files use kebab-case names, one `Feature` per file.
- No secrets, real credentials, or production PII in steps, tables, or `Examples` (`../../../system/SECURITY_RULES.md`).
- Authorization-denial scenarios name the denied actor and the observable refusal — they are required, not optional (`../../security/authorization-security`).

## Anti-Patterns

- A scenario that scripts the UI click by click when a state precondition would say it.
- `Then the request succeeds` with nothing observable named.
- One long scenario covering signup, login, and permissions.
- Functional behavior plus a load-time or accessibility assertion in the same scenario.
- `foo` / `bar` data in a specification meant to read as a real example.
- A `Scenario Outline` with twenty rows and no distinct behavioral value.
- Feature files kept as decoration while the real coverage lives somewhere else and disagrees.
- Adding Cucumber to a project because scenarios were written.

## Validation Checklist

- [ ] One `Feature` per file; kebab-case name aligned with the title; user story present.
- [ ] Each scenario specifies one behavior and runs independently.
- [ ] Required cases each have their own scenario, including authorization denial.
- [ ] Steps are domain-level — no selectors, endpoints, SQL, or waits unless that is the behavior.
- [ ] `Given` is minimal but sufficient; state preferred over navigation.
- [ ] Strict Given → When → Then; no `Or`; no repeated phases.
- [ ] Every `Then` names an observable, checkable outcome.
- [ ] Concrete, realistic example data; no secrets or production PII.
- [ ] Formatting: 2-space indent, blank line between scenarios, none between steps, lines under 120 characters.
- [ ] Each scenario maps to one test at the chosen level, or is explicitly recorded as not yet automated.
- [ ] Vocabulary matches the rest of the project's scenarios.

## Definition of Done

Scenarios that a stakeholder can read as the specification, that satisfy `../../../system/GHERKIN_RULES.md`, cover the required cases one behavior at a time, and each map to a named test — with anything unautomated flagged as such rather than implied.

## Related Skills

`testing-selection`, `../../testing-strategy`, `unit-testing`, `integration-testing`, `api-integration-testing`, `playwright-e2e`, `maestro-e2e`, `regression-testing`, `../../feature-planning`, `../../task-planning`, `../../bug-investigation`, `../../security/authorization-security`.

## Related Knowledge

`../../../knowledge/testing/` (project scenario conventions, vocabulary decisions).

## Related References

`../../../references/testing/` (existing feature files and step-definition patterns, when populated).

## Context Loading Guidance

- **Requires:** the behavior being specified, its actors/states, the work item, the chosen test level.
- **Does not require:** implementation internals, the full test suite, unrelated features.
- **May load:** `testing-selection` for the level/tool mapping; the relevant E2E skill when scenarios drive E2E.
- **Stop when:** the scenarios exist, pass the checklist, and are mapped to tests.

## Token Efficiency Guidance

Write the scenarios themselves — they are the specification, so prose *about* them is duplication. Link `../../../system/GHERKIN_RULES.md` instead of restating the contract, and use a `Scenario Outline` or a data table where it collapses repetition rather than listing near-identical scenarios.
