---
name: repository-architecture
description: Use after architecture design to define the on-disk repository layout — single-repo vs monorepo, app/package boundaries, directory conventions, and shared-code placement. Translates the logical architecture into a concrete, navigable structure. No application code.
---

# Repository Architecture

## Purpose

Translate the logical architecture into a concrete repository layout: how apps and packages are organized on disk, directory conventions, and where shared code lives — so implementation has an agreed structure to fill in.

## When to Use

- After `architecture-design`, before implementation scaffolding.
- When adding a new application area to an existing repo (fitting its conventions).
- **Not** for edits within an already-established structure.

## Inputs

- The recorded architecture (`architecture-design`).
- Selected applications and approved stack.
- Existing repo conventions (`existing-project-audit`) when applicable.

## Discovery Questions

- Single repo or monorepo? Any tooling constraint (workspaces, package manager)?
- How many applications and shared packages must coexist?
- Are there existing conventions to match?

## Responsibilities

- Decide **repo strategy** (single-app · multi-app monorepo) with justification.
- Define **top-level layout** (apps, packages, shared, tooling, docs).
- Place **`docs/` at the root** with one folder per application, named as the apps are named here (`application-documentation`).
- Set **directory conventions** per application type.
- Place **shared code** (types, UI, utilities) so ≥2 consumers can use it cleanly.
- Keep the layout consistent with the approved stack and `../../system/` conventions.
- Describe structure as **documentation**, not committed application code.

## Required Workflow

1. Read architecture + selected apps + stack.
2. Choose repo strategy.
3. Define top-level and per-app directory layout, including `docs/` and its per-app folders.
4. Decide shared-code placement.
5. Record the layout (in `../../projects/current/` / `../../knowledge/`).
6. Hand off to task/phase generation.

## Decision Rules

- Monorepo only when ≥2 apps/packages genuinely share code or lifecycle; otherwise single-app.
- Match existing conventions in an established repo rather than imposing new ones.
- Shared packages exist only with ≥2 real consumers (aligns with `application-selection`).
- Keep the tree shallow and predictable; optimize for navigation.

## Rules

- No application code or dependency install — layout is documented, then filled during implementation.
- Consistent with the approved stack and system conventions.
- Record the "why" behind strategy and boundaries.

## Anti-Patterns

- Monorepo with one app "just in case."
- Deep, inconsistent directory nesting.
- Shared packages with a single consumer.
- Reorganizing an existing repo without cause.

## Validation Checklist

- [ ] Repo strategy chosen + justified.
- [ ] Top-level layout defined.
- [ ] Per-app conventions defined.
- [ ] `docs/` placed at the root, one folder per application.
- [ ] Shared-code placement decided.
- [ ] Consistent with stack + existing conventions.
- [ ] No code committed.

## Definition of Done

A recorded repository layout (strategy, top-level tree, per-app conventions, shared-code placement) consistent with the architecture and stack, ready to guide implementation.

## Related Skills

`architecture-design`, `application-selection`, `stack-recommendation`, `application-documentation`, `task-planning`, `git-workflow`, `github-repository`.

## Related Knowledge

`../../knowledge/` (structure decisions).

## Related References

None typically.

## Context Loading Guidance

- **Requires:** architecture, selected apps, stack, existing conventions (if any).
- **Does not require:** full source, references, review skills.
- **May load:** none (returns to orchestrator/task-planning).
- **Stop when:** the layout is recorded.

## Token Efficiency Guidance

Express the layout as a compact tree plus a few convention notes. Don't enumerate every future file — define patterns, not contents.
