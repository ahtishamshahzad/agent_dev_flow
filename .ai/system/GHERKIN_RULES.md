# Gherkin Rules — Behavior Specification Contract

Every behavior this system specifies — acceptance criteria, test cases, required cases on a work item — is written as **Gherkin scenarios**, and every scenario written under this system follows the contract below. This file is the canonical contract; skills and templates link here and never restate it (`DOCUMENTATION_RULES.md`).

Scenarios are **living documentation and specification by example**: readable by non-automation stakeholders, deterministic enough for an agent to follow, automation-ready without leaking implementation detail. Reference grammar: Cucumber-compatible Gherkin (<https://cucumber.io/docs/gherkin/reference/>).

**Scope of "must".** Writing scenarios in this format is required whenever behavior is specified (Gate 4 acceptance criteria, Gate 5 required cases). Adopting a Cucumber-family runner is a **stack decision** (`STACK_DECISION_RULES.md`) — not assumed, not installed unasked. When the project has no such runner, the scenarios are still written, in the work item, and the chosen test framework implements them one test per scenario (`../skills/testing/gherkin-specifications/SKILL.md`).

## Guiding principles

- **Behavior-driven** — describe *what* the system does, never *how* it is implemented.
- **Humans first** — any engineer reads it and knows what to do and what should happen.
- **Specification by example** — a scenario is a concrete example, not a rule statement.
- **One behavior per scenario.**
- **Independent scenarios** — each runs in isolation, in any order.

## Files and organization

- **MUST** save Gherkin in `*.feature` files.
- **MUST** use kebab-case file names.
- **SHOULD** keep feature files under one main directory unless the project's layout dictates otherwise (`../skills/repository-architecture`).
- **MAY** use sub-directories; **SHOULD** organize by functional behavior area.

## Formatting

- **MUST** use one `Feature` per file.
- **MAY** have multiple `Scenario` / `Scenario Outline` blocks under that `Feature`.
- **MUST** indent the body of `Feature`, `Background`, `Scenario`, `Scenario Outline`, and `Examples` by **2 spaces**.
- **SHOULD** keep lines under **120 characters**.
- **SHOULD** separate major sections, and adjacent `Scenario` blocks, with **one blank line**.
- **MUST NOT** put blank lines between steps within a scenario or background.
- **SHOULD** avoid comments — the scenario text is the explanation.

## Vocabulary

- **MUST** use one stable vocabulary for roles, domain objects, and states.
- **MUST NOT** swap synonyms for the same concept ("order" / "purchase" / "cart") unless the product genuinely distinguishes them.

## Feature blocks

- **MUST** name `Feature:` after the behavior area it covers, on a single line.
- **SHOULD** align the file name with the `Feature:` title.
- **SHOULD** include the user story under the title, as three lines: `As a <role>` · `I want <goal>` · `So that <reason>`.

## Background

- **MAY** be omitted — `Background` is optional.
- **MUST** be used only for a starting state shared by **multiple** scenarios in the file.
- **MUST NOT** appear more than once per `Feature`.
- **MUST NOT** be used when only one scenario needs the setup.
- **SHOULD** stay short; a growing background means the file should be split.

## Scenarios

- **MUST** give each scenario a single-line, behavior-focused title.
- **MUST** be chronologically executable, step by step.
- **SHOULD** be declarative rather than imperative.
- **SHOULD** keep steps at a **domain / business level** — product language, not framework or plumbing terms.
- **MUST NOT** leak automation or UI mechanics (selectors, XPath, "wait for", "scroll to", "click element #foo") unless the behavior under test is that mechanic.
- **MUST NOT** put HTTP endpoints, SQL, internal schema, or storage mechanics in step text unless the behavior specified is inherently at that layer (a service exposed only as an API).
- **SHOULD** prefer **state over navigation** — `Given the user is signed in with role "Editor"` rather than a click-by-click tour — unless the interaction path is what the scenario specifies.
- **SHOULD** keep `Given` **minimal but sufficient**: only the preconditions a reader needs.
- **MUST NOT** bundle independent quality concerns (functional behavior plus performance, accessibility, or unrelated security checks) in one scenario. Split them.
- **SHOULD** use concrete, realistic example values; **SHOULD NOT** use `foo` / `bar` / `test` / `lorem` unless genericness or invalidity is the point.
- **SHOULD** target **fewer than 10 steps**; longer means split the behavior or use a table.

### Scenario Outline

- **MUST** be used only when the **same behavior** needs multiple input variations.
- **SHOULD** be a plain `Scenario` when the inputs do not materially change the behavior specified.

## Steps

**Language**

- **MUST** be third person, present tense, subject–predicate.
- **MUST** use proper English grammar and spelling; **SHOULD** minimize punctuation.
- **MUST** use double quotes for string parameters.
- **SHOULD NOT** combine multiple actions or assertions in one step — split them.

**Given / When / Then** — Arrange / Act / Assert

- **MUST** keep strict `Given` → `When` → `Then` order.
- **MUST NOT** repeat a phase inside one scenario; write a separate scenario instead.
- **MAY** use `And` to continue a step type, and `But` sparingly for contrast.
- **MUST NOT** use `Or`. Choices become separate scenarios or a `Scenario Outline`.

**Outcomes**

- **MUST** make `Then` outcomes observable and checkable from the scenario text: what changed, what the user sees, what the system reports.
- **MUST NOT** assert "it works" / "it succeeds" without stating how that is known.

**Payloads and tables**

- **SHOULD** use doc strings (`"""`) for multiline or structured payloads rather than a giant quoted string or a chain of `And`s.
- **SHOULD** use step data tables instead of long `And` chains; headers concise and descriptive (often single-token, kebab-case).
- **SHOULD** keep step tables and `Examples` tables to a single screen; a table growing past that means the scenario is drifting into pure data-driven testing.

## Anti-patterns

- Multiple behaviors, or unrelated concerns, in one scenario.
- UI implementation detail (selectors, DOM structure) in step text.
- Over-specified navigation where state would say it more clearly.
- Bloated `Given` chains setting up context the scenario never uses.
- Vague assertions — "it works", "the user is logged in" with no observable signal.
- Placeholder data that reads like nothing real.
- `Scenario Outline` rows that add no distinct behavioral value.
- Scenarios or tables so long no human will read them.

## Required-case coverage

The system's required cases (`TESTING_SELECTION_RULES.md`, `../checklists/testing.md`) are expressed as scenarios — one per case, never bundled: **happy path · invalid input · error path · authorization denial · regression · critical environment/config validation**. An authorization-denial scenario states the denied actor, the attempted action, and the observable refusal.

## Template

```gherkin
Feature: <behavior area>
  As a <role>
  I want <goal>
  So that <reason>

  Background:
    Given <shared starting state>

  Scenario: <single behavior>
    Given <context>
    And <additional context>
    When <action>
    Then <observable outcome>
    And <additional observable outcome>

  Scenario: <single behavior using a step data table>
    Given the following <domain entities> exist:
      | <column-a> | <column-b> |
      | <value 1>  | <value 2>  |
    When <action>
    Then <observable outcome>

  Scenario Outline: <same behavior, varying inputs>
    Given <context>
    When <action> with "<input>"
    Then the outcome is "<outcome>"

    Examples:
      | input   | outcome   |
      | <case1> | <result1> |
      | <case2> | <result2> |
```

## Checklist (agents and humans)

- [ ] One behavior only; runs independently.
- [ ] No unrelated concerns bundled.
- [ ] Stable vocabulary — no synonym swapping.
- [ ] Domain-level abstraction; no UI/API/DB plumbing in steps.
- [ ] State over navigation where it reads clearer.
- [ ] Minimal but sufficient `Given`.
- [ ] Concrete, realistic example data.
- [ ] Third person, present tense, subject–predicate.
- [ ] Strict Given → When → Then; `Then` outcomes observable.
- [ ] Blank line between scenarios; no blank lines between steps; 2-space indentation.
- [ ] Under ~10 steps; tables fit one screen.

## Where scenarios live

- **Planning** — acceptance criteria in `../templates/FEATURE.md`, `../templates/TASK.md`, `../templates/BUG.md`, approved at Gate 4 (`QUALITY_GATES.md`).
- **Test plan** — the scenario set per critical behavior in `../templates/TEST_PLAN.md`, checked at Gate 5.
- **Project** — `*.feature` files in the application repository when a Cucumber-family runner is part of the approved stack.

Applying the contract in a project — writing the scenarios, mapping them to tests, keeping them from rotting — is `../skills/testing/gherkin-specifications/SKILL.md`.
