---
name: stack-recommendation
description: Use after applications are selected to recommend a technology stack per area (mobile, web, backend, database + data layer, testing) with justification and alternatives. Pairs databases with data layers correctly; never compares a database against an ORM. Requires user approval before any code.
---

# Stack Recommendation

## Purpose

Recommend a stack per relevant area, with justification and credible alternatives, for the selected applications only. Implements `../../system/STACK_DECISION_RULES.md`. The user approves before any implementation (Gate 2).

## When to Use

- After `application-selection`, before architecture and implementation.
- When an existing repo needs a stack decision for a new application area.
- **Not** when the stack is already approved and unchanged (respect it).

## Inputs

- Selected applications (`application-selection`).
- Requirement baseline (constraints, scale, team familiarity).
- Audit findings for existing stacks (`existing-project-audit`).

## Discovery Questions

- Any mandated or pre-existing stack to align with?
- Team familiarity and ecosystem preferences?
- Expected scale, and any lock-in tolerance?
- Constraints (offline, real-time, compliance) that force a choice?

## Responsibilities

- For each **required** area, recommend a choice with 1–3 sentence justification and note alternatives + lock-in risk.
- Decision areas: **Mobile** (Expo · RN CLI; nav: Expo Router · React Navigation; state: local · Context · Redux Toolkit · Zustand · server-state; API: fetch · Axios · RTK Query · TanStack Query); **Web** (Next.js · Vite+React); **Backend** (Express · NestJS · justified other); **Database** (PostgreSQL · MySQL · MongoDB); **Data layer** (Prisma · Drizzle · Mongoose · native driver, paired to the DB); **Testing** (Jest · Vitest · Supertest · Playwright · Maestro · RNTL).
- Produce a **recommendation table**: area → recommendation → justification → alternatives.

## Required Workflow

1. Take the selected applications.
2. For each required area, evaluate options against the requirements.
3. Pair database + data layer correctly.
4. Build the recommendation table, then the **version baseline** with `technology-governance`: latest stable per area, verified against the registry and official version-matched docs (not memory), compatible across the chain (`../../system/TECHNOLOGY_GOVERNANCE_RULES.md`). In an existing project, the installed technology is the first option for every area it covers.
5. Present for Gate 2 approval; record the approved stack and baseline.
6. Do **not** install dependencies here.

## Decision Rules

- **Pair, don't mis-compare:** a database is storage; a data layer/ORM is access. Correct: PostgreSQL+Prisma, MySQL+Drizzle, MongoDB+Mongoose. Incorrect: "Prisma vs MongoDB."
- Relational DB → relational ORM; document DB → document ODM.
- Recommend only areas the selected apps require; keep it proportional.
- Prefer shared ecosystem across apps when it reduces cost, but never force a poor fit.

## Rules

- No stack is pre-selected by the system; recommend and get approval.
- No dependency installation at this stage.
- Justify every recommendation; name alternatives considered.

## Anti-Patterns

- Comparing a database against an ORM.
- Recommending a full stack for a small feature.
- Installing packages before approval.
- Silent, unjustified stack picks.

## Validation Checklist

- [ ] Only required areas covered.
- [ ] Each area: recommendation + justification + alternatives.
- [ ] Database paired with a matching data layer.
- [ ] No database-vs-ORM comparison.
- [ ] Presented for Gate 2; approval recorded.
- [ ] No dependencies installed.

## Definition of Done

An approved per-area stack recommendation table recorded in `../../projects/current/`, with correct DB/data-layer pairings and no dependencies installed.

## Related Skills

`application-selection`, `architecture-design`, `dependency-audit`, `testing-strategy`, `project-orchestrator`.

## Related Knowledge

`../../knowledge/` (existing architecture/constraints).

## Related References

`../../references/<stack-topic>/` only when an option needs grounding.

## Context Loading Guidance

- **Requires:** selected applications, requirement constraints, existing-stack findings.
- **Does not require:** full source, unrelated references, implementation skills.
- **May load:** `dependency-audit` (existing deps), one stack reference folder if needed.
- **Stop when:** the table is approved and recorded.

## Token Efficiency Guidance

Evaluate from requirement/audit summaries. Keep justifications to a few sentences; link a reference folder rather than pasting comparisons.
