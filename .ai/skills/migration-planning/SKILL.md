---
name: migration-planning
description: Use to plan a move from one state to another (framework/version/data/schema/infra) safely and incrementally, with a compatibility strategy, per-step verification, a rollback path, and an explicit cutover. Production migrations require approval.
---

# Migration Planning

## Purpose

Plan a safe, incremental migration from a current state to a target state, keeping the system working between steps where possible and preserving a rollback path. Produces a migration work item in `../../work-items/migrations/`.

## When to Use

- Request classified as **migration** (framework/version/data/schema/infra).
- **Not** for in-place feature work or behavior-preserving cleanup.

## Inputs

- Current state and target state (versions, schema, infra).
- Audit findings (`existing-project-audit`, `dependency-audit`, `environment-audit`).

## Discovery Questions

- What is the exact from → to, and why now?
- What breaks between them (breaking changes, data shape, contracts)?
- Can old and new coexist during transition (compatibility window)?
- What is the rollback plan, and are backups in place for data/schema?
- Is production involved (requires approval)?

## Responsibilities

- Characterize the **gap** (from → to) and breaking changes.
- Plan **incremental, reversible steps** with a compatibility strategy.
- Define **per-step verification** and a **rollback path**.
- Define an explicit **cutover** with go/no-go criteria.
- For data/schema: require **backups** and a tested rollback.
- Flag production steps for approval (`../../mcp/PERMISSION_RULES.md`).

## Required Workflow

1. Confirm the migration is justified — for a technology or version change, by a trigger in `../../system/TECHNOLOGY_GOVERNANCE_RULES.md` §4, recorded in `../../templates/TECHNOLOGY_DECISION.md`. Audit current + target state; list breaking changes from the **official migration guide for the target version**, and protect the behavior it could affect with regression scenarios.
2. Design a compatibility strategy (dual-run/adapters where possible).
3. Break into incremental, reversible steps.
4. Define verification per step + rollback.
5. Define cutover criteria.
6. Record the migration work item; mark approval-required steps. On a tracked project, steps become `TECH-` tasks and the cutover a `DEPLOY-` task, scheduled by `project-management` (`../../system/PROJECT_MANAGEMENT_RULES.md`).

## Decision Rules

- Prefer incremental + reversible over big-bang cutover.
- Data/schema migrations require backups and a tested rollback before running.
- Keep the system functional between steps whenever feasible.
- Production migrations are outward-facing — explicit approval (`../../system/OPERATING_RULES.md`).

## Rules

- No irreversible data step without a verified backup/rollback.
- Verify at each step, not just at the end.
- Record the "why now" and the cutover criteria.

## Anti-Patterns

- Big-bang production migration with no rollback.
- Skipping the compatibility window when one is feasible.
- Running data migrations without backups.
- Cutting over without go/no-go criteria.

## Validation Checklist

- [ ] From → to and breaking changes characterized.
- [ ] Compatibility strategy defined.
- [ ] Incremental reversible steps.
- [ ] Per-step verification + rollback.
- [ ] Backups planned for data/schema.
- [ ] Cutover criteria defined.
- [ ] Production steps flagged for approval.

## Definition of Done

A recorded migration work item: characterized gap, compatibility strategy, incremental reversible steps with verification and rollback, backup plan for data/schema, and explicit cutover criteria — with production steps flagged for approval.

## Related Skills

`existing-project-audit`, `dependency-audit`, `environment-audit`, `task-planning`, `testing-strategy`, `security-review`, `release-planning`, `project-orchestrator`, `project-management`.

## Related Knowledge

`../../knowledge/` (current architecture, data model).

## Related References

`../../references/<migration-topic>/` for framework upgrade guides if needed.

## Context Loading Guidance

- **Requires:** current + target state, audit findings, breaking-change info.
- **Does not require:** unrelated modules, the full reference tree, unrelated skills.
- **May load:** `dependency-audit`, `environment-audit`, `release-planning` for cutover.
- **Stop when:** steps, verification, rollback, and cutover are recorded.

## Token Efficiency Guidance

Focus on the changed surface (deps, schema, config), not the whole app. Summarize breaking changes; link upgrade guides rather than pasting them.
