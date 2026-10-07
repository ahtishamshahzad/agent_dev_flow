# Feature — <feature name>

> Fill-in work-item template for a feature within existing architecture, without scope creep (`../skills/feature-planning`).

- **Date:** <YYYY-MM-DD> · **Owner:** <> · **Status:** planned | in-progress | done

## Goal

<What capability this adds and for whom.>

## In Scope

- <Included>

## Out of Scope

- <Explicitly excluded — creep guard>

## Design Notes

- <How it fits the architecture; contracts touched; data changes>

## Tasks

| # | Task | Owner | Acceptance |
|---|------|-------|------------|
| 1 | <> | <> | <> |

## Test Plan

- Required cases: happy · invalid input · error · **authorization denial** · regression — **one scenario each**, below.
- Levels/tools: <per `../skills/testing/testing-selection`>
- Scenario → test mapping: <scenario title → test file/case, or "not yet automated">

## Acceptance Criteria

Written as Gherkin scenarios — one behavior each, observable outcomes (`../system/GHERKIN_RULES.md`, `../skills/testing/gherkin-specifications`). These scenarios *are* the criteria; do not restate them in prose. Drafted here, **approved at Gate 2 before design**, then saved to `features/<area>/<behavior>.feature` — after which this section lists them by file and title instead of copying them.

- **Feature file:** `features/<area>/<behavior>.feature` · **Approved:** <date, by> · **Release-blocking (`@critical`):** <titles>

```gherkin
Feature: <behavior area>
  As a <role>
  I want <goal>
  So that <reason>

  Scenario: <happy path>
    Given <context>
    When <action>
    Then <observable outcome>

  Scenario: <invalid input>
    Given <context>
    When <action with invalid input>
    Then <observable rejection>

  Scenario: <authorization denial>
    Given <actor without the required permission>
    When <the actor attempts the action>
    Then <observable refusal>
```

- [ ] Every scenario above passes, is reviewed, and adds no scope beyond this work item.

## Related

- Workflow: `../workflows/new-feature.md`. Hooks: `../hooks/before-feature.md`, `after-feature.md`.
