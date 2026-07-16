# Phase Generation Rules

Phases are **generated dynamically** for each piece of work. There is no single fixed roadmap. Reject any "one-size-fits-all" project plan.

## Generate phases from

- **Applications selected** (`APPLICATION_SELECTION_RULES.md`)
- **Feature dependencies** (what must exist before what)
- **Architecture dependencies** (shared foundations, contracts, boundaries)
- **Security needs** (auth, data protection, compliance)
- **Testing needs** (levels and tools per application)
- **Deployment requirements** (targets, environments, release process)
- **Existing implementation state** (what already exists in the repo)

## Principles

1. **Dependency-ordered.** A phase may start only when its prerequisites are complete.
2. **Right-sized.** A one-line bug fix is not a 7-phase program; a marketplace is not one phase.
3. **Each phase has a goal and an exit gate.** No phase advances past a failed gate (`QUALITY_GATES.md`).
4. **Foundations before features.** Shared design system, contracts, and auth precede domain features that depend on them.
5. **Testing and security are phases or gates, not afterthoughts.**

## Illustrative shapes (examples, not templates)

**Bug:**
1. Audit → 2. Reproduction → 3. Root cause → 4. Fix → 5. Regression test → 6. Release validation

**Mobile app with an existing backend:**
1. Discovery → 2. Design system → 3. Mobile foundation → 4. Authentication → 5. Domain features → 6. Maestro testing → 7. Release

**Full-stack marketplace:**
A larger sequence spanning discovery, architecture, shared packages, backend + data layer, auth, seller/buyer domains, admin dashboard, payments, testing across apps, and staged release — ordered by dependency.

These are **shapes to reason from**, not fixed plans. Derive the actual phases from the inputs above.

## Each generated phase records

- **Name & goal**
- **Prerequisites** (which phases/decisions must precede it)
- **Applications/areas in scope**
- **Required skills** (`SKILL_SELECTION_RULES.md`)
- **Exit gate** (`QUALITY_GATES.md`)
- **Tasks** (`TASK_GENERATION_RULES.md`)

## Output

Phases are proposed at the second approval gate (with tasks) and stored in `../projects/current/`. Re-generate or adjust phases when scope, dependencies, or discovered state change — record the change and reason.
