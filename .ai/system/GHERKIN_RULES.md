# Gherkin Rules — Behavior Specification Contract

Every behavior this system specifies — acceptance criteria, test cases, required cases on a work item — is written as **Gherkin scenarios**, and every scenario written under this system follows the contract below. This file is the canonical contract; skills and templates link here and never restate it (`DOCUMENTATION_RULES.md`).

Scenarios are **living documentation and specification by example**: readable by non-automation stakeholders, deterministic enough for an agent to follow, automation-ready without leaking implementation detail. Reference grammar: Cucumber-compatible Gherkin (<https://cucumber.io/docs/gherkin/reference/>).

## Mandatory policy

> **Every behavior-changing engineering task has an approved Gherkin specification before implementation begins.**

Gherkin is the **behavioral contract** that connects requirements → architecture → tasks → implementation → tests → regression → release. It is not a testing format the team may choose to use.

**Required for** any change to observable behavior: new or changed features · bug and regression fixes · API contracts (requests, responses, errors, pagination, idempotency) · UI and mobile flows, including offline/online · business rules, validation, and error handling · authentication, authorization, roles, and tenant isolation · payments and subscriptions · notifications, integrations, webhooks, queues, and background jobs · data workflows · configuration that changes runtime behavior · externally observable performance limits · AI and agent features · admin functionality · release-critical changes.

**Not required for** changes with no observable effect: formatting · comments · documentation-only changes · renames and internal restructuring · dependency patches with no behavior change · refactors whose zero behavior change is proven by the existing tests (`../skills/refactor-planning`).

**When unsure, specify.** If it is not clear whether behavior changes, write or update the scenarios. A rename that changes an API field name *is* a behavior change.

**Gherkin states what the system must do; automated tests are the evidence that it does.** A scenario proves nothing until a test implements it and passes. Writing Gherkin does not execute anything, and a passing test suite with no scenario behind a behavior means that behavior was never agreed.

Adopting a Cucumber-family **runner** is a stack decision (`STACK_DECISION_RULES.md`) — not assumed, not installed unasked. Without one, the scenarios are still written and each maps to one named test in the chosen framework (`../skills/testing/gherkin-specifications/SKILL.md`).

## Where it sits in the lifecycle

| Stage | What happens to the scenarios |
|---|---|
| Requirements (`ORCHESTRATION_WORKFLOW.md`) | Acceptance criteria are written **as** scenarios, or mapped one-to-one to them. Requirements and scenarios never contradict |
| **Behavior specification** | Before architecture: what changes, for whom, success and failure, edge cases, and what must stay unchanged — written as scenarios |
| **Gate 2** (`QUALITY_GATES.md`) | The user approves the behavior — before any design or code |
| Architecture | Designed to satisfy the scenarios: an offline scenario demands local persistence, sync, idempotency, and conflict handling |
| Tasks — Gate 4 | Each task names the scenarios it delivers |
| Implementation | Against the approved scenarios only. Behavior they don't cover is a scope question (below), not a coding decision |
| Testing — Gate 5 | Each scenario maps to a named test; the test passes |
| Review — Gate 6 | Security behavior is specified as scenarios — which state the expectation; tests and review provide the evidence |
| Release — Gate 7 | Every `@critical` scenario is verified by a passing test |

**Bugs:** reproduce → find the existing scenarios → state expected vs actual → write the regression scenario (it fails on the current code) → root cause → fix → the scenario's test passes → it stays permanently. A bug fix needs the user's approval of the scenario only when the expected behavior is disputed or changes what users experience.

## Scope control and change detection

- **Behavior not covered by an approved scenario is not built silently.** Stop and classify it: necessary implementation detail · missing acceptance criterion · bug · scope change. Anything beyond implementation detail updates the scenarios and goes back for approval (`PROJECT_MANAGEMENT_RULES.md` §Scope changes).
- **Update the scenarios when observable behavior changes:** a response shape, a business rule, an error, a permission, a user-visible flow. **Don't** when only the implementation changes (a query rewritten, a module split) — scenarios describe behavior, not implementation.
- **Multi-agent work** (`MULTI_AGENT_RULES.md`): the approved scenarios are the shared contract every agent builds against. An agent that finds the behavior must change stops, proposes the scenario change, and waits for approval — it never reinterprets the behavior on its own.

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

## Tags

Tags are `@kebab-case`. Use the ones that describe the behavior; none are required on every scenario.

| Kind | Tags |
|---|---|
| Release | `@critical` — release-blocking: Gate 7 needs its test passing |
| Origin | `@regression` (kept from a fixed bug) · `@bugfix` · `@bug-NNN` (traceability to the bug record) |
| Area | `@api` `@web` `@mobile` `@backend` `@integration` `@offline` `@ai` |
| Concern | `@security` `@authentication` `@authorization` `@payment` `@subscription` `@performance` |

## Where scenarios live

Scenarios are permanent — they outlive the work item that created them, which is what makes regression coverage last.

- **Home** — `features/<area>/<behavior>.feature` at the application repository root (one area per folder: `features/authentication/`, `features/billing/`, …), whether or not a Cucumber-family runner is used. An established repo's existing feature folder wins.
- **Planning** — `../templates/FEATURE.md`, `../templates/TASK.md`, and `../templates/BUG.md` list the scenarios they deliver **by file and title**, rather than copying them; new scenarios are drafted there and moved into `features/` when approved.
- **Test plan** — `../templates/TEST_PLAN.md` maps each critical scenario to its test, checked at Gate 5.
- **Trace them** — a test's name contains its scenario's title, so the mapping is checkable: `agentflow gherkin trace features --tests <test dirs>` lists scenarios no test names and exits 1 for an untested `@critical` one (it proves a test exists, not that it passes — CI does that).
- **Check them** — `agentflow gherkin validate` (or `npx github:ahtishamshahzad/agent_dev_flow gherkin validate`) lints `features/` against this contract; add it to CI. It checks structure, not whether the behavior is right.
- **Examples** — `examples/gherkin/` in the AgentFlow repository.

Applying the contract in a project — writing the scenarios, mapping them to tests, keeping them from rotting — is `../skills/testing/gherkin-specifications/SKILL.md`.
