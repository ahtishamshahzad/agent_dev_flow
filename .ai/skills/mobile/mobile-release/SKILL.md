---
name: mobile-release
description: Use to plan mobile release — store submission (EAS Submit / native), versioning, OTA updates (Expo), staged rollout, and release validation. Publishing to stores requires explicit approval; coordinates readiness.
---

# Mobile Release

## Purpose

Plan the release: store submission, versioning/build numbers, OTA updates (Expo), staged rollout, and release validation — with store publishing gated by approval.

## When to Use

- For a mobile release/deployment.
- When planning OTA updates or store submission.
- Not to publish without explicit approval or a passed release gate.

## Inputs

- Validated builds (`mobile-builds`) and readiness (`ios-readiness`, `android-readiness`).
- Store accounts, versioning, rollout strategy.

## Discovery Questions

- Store submission via EAS Submit or native tooling?
- What versioning/build-number scheme?
- OTA updates (Expo) for JS-only changes, and their limits?
- Staged rollout or full release? Rollback plan?

## Responsibilities

- Plan **store submission** (EAS Submit / native) and **versioning**.
- Plan **OTA updates** (Expo) for eligible JS-only changes, with limits noted.
- Plan **staged rollout** and **rollback**.
- Confirm **readiness** (`ios-readiness`, `android-readiness`) and run **release validation** (`../../release-planning`, Gate 7).

## Required Workflow

1. Confirm builds validated + readiness passed.
2. Set versioning/build numbers.
3. Plan submission + OTA + rollout/rollback.
4. Confirm explicit approval to publish.
5. Execute/handoff; verify + record.

## Decision Rules

- Store publishing is outward-facing — explicit approval required (`../../../system/OPERATING_RULES.md`).
- OTA suits JS-only changes; native changes need a new store build.
- Prefer staged rollout for risky releases with a rollback path.
- Don't ship on a failed gate (`../../release-planning`).

## Rules

- No store submission without explicit approval.
- Follow Gate 7 (`../../release-planning`).
- Keep signing/store credentials secure.

## Anti-Patterns

- Submitting to stores without approval.
- OTA-ing native changes.
- Full rollout of risky releases with no rollback.
- Shipping with failing readiness/tests.

## Validation Checklist

- [ ] Builds validated + readiness passed.
- [ ] Versioning/build numbers set.
- [ ] Submission + OTA + rollout/rollback planned.
- [ ] Explicit publish approval obtained.
- [ ] Release validated + recorded.

## Definition of Done

A recorded release plan: store submission, versioning, OTA strategy, staged rollout with rollback, and release validation (Gate 7) — with store publishing explicitly approved and verified.

## Related Skills

`mobile-builds`, `ios-readiness`, `android-readiness`, `../../release-planning`, `../../github-repository`, `mobile-maestro-e2e`

## Related Knowledge

`../../../knowledge/` (release process, store accounts).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** validated builds, readiness status, versioning + rollout strategy, approval.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `../../release-planning`, readiness skills, `mobile-builds`.
- **Stop when:** the release is validated and recorded (or blocked at Gate 7).

## Token Efficiency Guidance

Work from build/readiness status; keep the release record to criteria, actions, outcome.
