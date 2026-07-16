---
name: mobile-project-audit
description: Use when a mobile app already exists, before changing it — inventory the runtime (Expo vs CLI), navigation, state, native modules, build config, and iOS/Android readiness. Read-only; grounds mobile planning in reality. Delegates deep security/performance to their skills.
---

# Mobile Project Audit

## Purpose

Understand an existing mobile app before changing it: its runtime, structure, navigation, state approach, native modules, build/release setup, and platform readiness — so mobile planning is grounded, not assumed. The mobile counterpart to `../../existing-project-audit`.

## When to Use

- Any request against an existing mobile codebase.
- Before recommending a runtime change or mobile migration.
- **Not** for greenfield mobile work (record "greenfield").

## Inputs

- Read access to the mobile project.
- The classified request (to scope the audit).

## Discovery Questions

- Expo or React Native CLI? Which SDK/RN version?
- What navigation, state, and data-fetching approaches are in use?
- Which native modules/SDKs and permissions are present?
- What is the current build/release setup (EAS? Fastlane? manual)?

## Responsibilities

- Detect **runtime** (Expo managed / dev builds / bare CLI) and versions.
- Map **navigation**, **state ownership**, and **data-fetching** patterns.
- Inventory **native modules**, permissions, and config plugins.
- Assess **build/release** setup and **iOS/Android readiness** signals.
- Flag security/performance signals; hand depth to `../../security-review` / `mobile-performance`.
- Record findings; do **not** edit code.

## Required Workflow

1. Scope the audit to the request.
2. Detect runtime + versions from config (`app.json`/`app.config`, `Podfile`, Gradle).
3. Map navigation/state/data patterns from representative screens.
4. Inventory native modules, permissions, plugins.
5. Survey build/release and readiness.
6. Record findings + risks.

## Decision Rules

- Report what the project proves vs what you infer.
- Scope to the affected area for small requests; don't audit everything.
- Deep security/performance analysis is delegated, not done here.

## Rules

- Read-only; no edits during the audit.
- Do not print secret values (redact) (`../../security-review`).
- Ground later mobile stages in findings, not guesses.

## Anti-Patterns

- Proposing changes before understanding the runtime/patterns.
- Auditing the whole app for a one-screen change.
- Treating inferences as confirmed.

## Validation Checklist

- [ ] Runtime + versions detected.
- [ ] Navigation/state/data patterns mapped.
- [ ] Native modules/permissions/plugins inventoried.
- [ ] Build/release + readiness surveyed.
- [ ] Security/performance signals flagged.
- [ ] No code edited.

## Definition of Done

A scoped, read-only audit of the mobile app covering runtime, patterns, native modules, build/release, and readiness — confirmed vs inferred separated — ready to inform mobile planning.

## Related Skills

`../../existing-project-audit`, `mobile-stack-selection`, `mobile-navigation`, `mobile-state-management`, `mobile-native-modules`, `mobile-builds`, `ios-readiness`, `android-readiness`, `../../security-review`, `mobile-performance`.

## Related Knowledge

`../../../knowledge/` (existing mobile architecture).

## Related References

`../../../references/mobile/` topic folders when populated.

## Context Loading Guidance

- **Requires:** mobile project read access, the classified request.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `mobile-native-modules`, `mobile-builds`, readiness skills for depth.
- **Stop when:** the scoped audit is recorded.

## Token Efficiency Guidance

Read config and representative screens first; sample, don't read everything. Summarize into findings; don't paste large files.
