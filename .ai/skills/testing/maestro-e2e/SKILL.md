---
name: maestro-e2e
description: Use to plan mobile end-to-end and smoke tests with Maestro — critical device flows on emulator/simulator, resilient to timing, covering happy path plus key error and authorization-denied variants. Reserved for critical mobile journeys; coordinates with the mobile pack.
---

# Maestro E2E

## Purpose

Verify **critical mobile journeys** end-to-end on a device/emulator using **Maestro** — the few flows whose breakage blocks release — plus fast **smoke** flows for post-build/deploy confidence. The mobile pack's `../../mobile/mobile-maestro-e2e` owns mobile-side detail; this testing-pack skill places Maestro in the cross-project testing strategy.

## When to Use

- For business-critical mobile journeys (onboarding, login, core transaction) and smoke checks.
- **Not** for logic (`unit-testing`), component behavior (Testing Library / `../../mobile/mobile-component-testing`), or web (`playwright-e2e`).

## Inputs

- Selected mobile app + critical flows (`testing-selection`, `../../mobile/mobile-stack-selection`).
- Build to test against + device/emulator (`../../mobile/mobile-builds`), seeded backend state (`test-data-management`).

## Discovery Questions

- Which mobile flows are critical enough for device E2E (few, high-value)?
- Which minimal flows form the **smoke** set (app launches, logs in, core screen loads) for post-deploy checks?
- What backend/test state must exist for the flows to run deterministically?

## Responsibilities

- Take the behavior to be covered from its **Gherkin scenarios** (`gherkin-specifications`) — implement one test per scenario rather than inventing a parallel case list.
- Cover **critical device journeys**: **happy path** through the real app, plus key **error** and **authorization-denied** variants at the journey level.
- Define a **smoke set**: minimal, fast flows proving the build is fundamentally alive (launch → auth → primary screen) — run after builds/deploys (`smoke-testing`, `../../devops/production-readiness`).
- Use Maestro's **resilient waiting** (element-based, not fixed sleeps); stable selectors (ids/accessibility labels — `../../mobile/mobile-accessibility`).
- Control backend/test state deterministically (`test-data-management`); run on emulator/simulator in CI where feasible (`../../devops/ci-cd`, `../../mobile/mobile-builds`).
- Keep the set **small** — top of the mobile pyramid; push detail to component/unit tests.

## Required Workflow

1. Select critical flows + define the smoke set.
2. Ensure a testable build + deterministic backend state.
3. Script flows with element-based waits + stable selectors.
4. Wire E2E + smoke into CI/build pipeline.
5. Keep small; move detail down the pyramid.

## Decision Rules

- Device E2E for whole-journey integration only; component-level cases go to `../../mobile/mobile-component-testing`.
- Smoke flows stay minimal and fast — they gate deploys, not features.
- Element-based waits, never sleeps (flakiness — `flaky-test-audit`).
- A flaky device test is worse than none — stabilize or cut.

## Rules

- Deterministic backend/test state per run.
- Runs against a real build on device/emulator.
- Failures produce logs/screenshots for triage.

## Anti-Patterns

- E2E-testing every screen/edge on device.
- Fixed sleeps to paper over timing.
- Selectors tied to volatile UI text.
- Smoke sets that balloon into full regression suites.
- Duplicating component coverage on device.

## Validation Checklist

- [ ] Critical flows + minimal smoke set defined.
- [ ] Happy path + key error/authorization-denied variants.
- [ ] Element-based waits; stable selectors; no sleeps.
- [ ] Deterministic backend state.
- [ ] E2E + smoke CI-wired with failure artifacts; set kept small.

## Definition of Done

A small, stable Maestro suite covering critical mobile journeys and a fast smoke set — happy path plus key error/denial variants — with resilient waits, deterministic state, and CI/build integration.

## Related Skills

`../../mobile/mobile-maestro-e2e`, `testing-selection`, `playwright-e2e`, `smoke-testing`, `../../mobile/mobile-component-testing`, `test-data-management`, `flaky-test-audit`, `../../devops/ci-cd`, `../../devops/production-readiness`.

## Related Knowledge

`../../../knowledge/` (critical mobile flows).

## Related References

`../../../references/testing/` (mobile E2E patterns, when populated).

## Context Loading Guidance

- **Requires:** critical mobile flow list, testable build, backend seed strategy.
- **Does not require:** unit internals, unrelated screens.
- **May load:** `../../mobile/mobile-maestro-e2e`, `smoke-testing`.
- **Stop when:** critical flows + smoke set pass stably in CI.

## Token Efficiency Guidance

The flow list (critical + smoke) bounds the suite; don't enumerate every screen — that detail lives lower in the pyramid.
