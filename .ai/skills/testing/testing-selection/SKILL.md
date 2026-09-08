---
name: testing-selection
description: Use to choose which test types and tools a project needs — Playwright (web/dashboard E2E), Maestro (mobile E2E/smoke), Supertest (backend API integration), Testing Library (components), Jest/Vitest (unit + integration logic). Selects only what the project's applications and risks justify; does not adopt every tool by default.
---

# Testing Selection

## Purpose

Decide the **test types and tools** for the project from its actual applications and risks — the right pyramid per app, and the specific tools that fit — so effort lands where failure hurts. Refines the core `../../testing-strategy` for concrete tooling; requires the application/stack decisions as input.

## When to Use

- After applications and stack are chosen (`../../application-selection`, `../../stack-recommendation`), when planning how the project is tested.
- When adding an application that changes the testing surface.
- **Not** for writing tests (the per-type skills) or per-bug regression (`regression-testing`).

## Inputs

- Selected applications (web, dashboard, mobile, backend API) and their risk/criticality.
- Stack per area (drives tool fit) and existing test setup if any (`../../existing-project-audit`).

## Discovery Questions

- Which applications exist, and what does each break if untested (money, auth, data loss)?
- What is the runtime per app (Node/TS backend, React web, React Native mobile) — which tools are idiomatic?
- Which flows are critical enough to warrant E2E, and which are covered cheaper at lower levels?
- Is there existing test tooling to extend rather than replace?

## Responsibilities

- Take the behavior to be covered from its **Gherkin scenarios** (`gherkin-specifications`) — implement one test per scenario rather than inventing a parallel case list.
- Map each application to its **levels + tools**, adopting **only what's needed**:
  - **Unit + integration logic** → **Jest or Vitest** (one, per stack convention — Vitest for Vite/modern TS, Jest where established); pure logic, services, reducers, hooks.
  - **Backend API integration** → **Supertest** (real HTTP against the app + real DB) — pairs with `../../backend/backend-integration-testing`.
  - **Component/interaction** → **Testing Library** (React / React Native) — accessible queries, user-facing behavior.
  - **Web/dashboard E2E** → **Playwright** — critical browser flows only.
  - **Mobile E2E + smoke** → **Maestro** — critical device flows only.
  - **Contract** → `contract-testing` where independently deployed clients/services must agree.
- Set the **pyramid shape** per app: many unit, fewer integration, few E2E — E2E is expensive and slow, reserved for critical end-to-end journeys.
- Record what is **not** adopted and why (no Playwright if there's no web app; no Maestro without mobile) — absence is a decision.
- Feed the choices to `../../devops/ci-cd` (jobs are generated from selected apps + selected test types) and to the per-type skills.

## Required Workflow

1. List applications with risk/criticality.
2. Assign levels + tools per app (adopt minimally).
3. Fix the pyramid shape and which flows earn E2E.
4. Record non-adoptions with reasons.
5. Hand off to the per-type skills and `../../devops/ci-cd`.

## Decision Rules

- One unit/integration runner per stack — not Jest *and* Vitest in the same app without cause.
- E2E tool follows the platform: Playwright for browsers, Maestro for devices — not one tool stretched across both.
- Supertest is the backend API-integration default (Node); it doesn't replace unit tests or E2E.
- Adopt a tool only when an application needs it; "might need it later" is not now.
- Risk drives depth, not a coverage number (`test-coverage-audit`).

## Rules

- Selection is recorded and tied to specific applications.
- No tool adopted for an application that doesn't exist.
- The selection drives CI job generation — keep them in sync.

## Anti-Patterns

- Adopting the full toolchain on every project reflexively.
- Playwright with no web app; Maestro with no mobile app.
- E2E-heavy pyramids (slow, flaky, expensive) instead of unit-heavy.
- Two unit runners in one app.
- Choosing tools before knowing the applications.

## Validation Checklist

- [ ] Applications listed with risk.
- [ ] Levels + tools assigned per app, minimally.
- [ ] Pyramid shape + E2E-worthy flows fixed.
- [ ] Non-adoptions recorded with reasons.
- [ ] Handed to per-type skills + `../../devops/ci-cd`.

## Definition of Done

A recorded per-application test-type-and-tool selection — Jest/Vitest, Supertest, Testing Library, Playwright, Maestro adopted only where an application justifies them — with the pyramid shape set and non-adoptions explained, feeding CI generation.

## Related Skills

`../../testing-strategy`, `unit-testing`, `integration-testing`, `api-integration-testing`, `contract-testing`, `playwright-e2e`, `maestro-e2e`, `../../devops/ci-cd`, `../../application-selection`, `../../stack-recommendation`.

## Related Knowledge

`../../../knowledge/` (application risk, critical flows).

## Related References

`../../../references/testing/` (tool-fit notes, when populated).

## Context Loading Guidance

- **Requires:** selected applications with risk, stack per area.
- **Does not require:** test code, the full skill set, unrelated references.
- **May load:** the per-type skills after selecting, `../../devops/ci-cd`.
- **Stop when:** the per-application selection is recorded.

## Token Efficiency Guidance

The application × (levels, tools) table is the artifact; decide per app, don't survey every tool for every app.
