---
name: architecture-design
description: Use after the stack is approved to define module boundaries, data flow, integration points, and cross-cutting concerns (auth, config, error handling). Produces the architecture that phases and tasks are generated from. Proportional to the request.
---

# Architecture Design

## Purpose

Define the system's shape: modules and their boundaries, how data flows, where integrations sit, and how cross-cutting concerns are handled — consistent with the approved applications and stack. Satisfies Gate 3.

## When to Use

- After Gate 2 (applications + stack approved), before phase/task generation.
- When a feature needs a design decision within an existing architecture.
- **Not** for a trivial change fully covered by existing patterns.

## Inputs

- Approved applications and stack (`../../projects/current/`).
- Requirement baseline and audit findings.

## Discovery Questions

- What are the core domains/bounded contexts?
- Which integrations (auth, payments, third-party APIs) are required?
- What are the consistency, availability, and scale expectations?
- What cross-cutting concerns need a single approach (auth, config, logging, errors)?

## Responsibilities

- Define **module/service boundaries** and responsibilities.
- Define **data flow** and ownership between modules/apps.
- Identify **integration points** and their contracts.
- Decide **cross-cutting concerns**: auth, configuration, error handling, logging.
- Keep the design **proportional** to the request.
- Feed `repository-architecture` for the on-disk layout.

## Required Workflow

1. Read the approved behavior scenarios (`../../system/GHERKIN_RULES.md`), apps/stack, and requirements.
2. Identify domains and boundaries **from the behavior**: every scenario's preconditions, failures, and edge cases need a home — an offline scenario demands local persistence, sync, retries, idempotency, and conflict handling; a duplicate-request scenario demands an idempotency mechanism.
3. Define data flow and contracts.
4. Decide cross-cutting approaches.
5. Record the architecture (Gate 3) in `../../projects/current/` / `../../knowledge/`.
6. Hand off to `repository-architecture` and phase generation.

## Decision Rules

- Boundaries follow domains and change-rate, not convenience.
- Prefer the simplest architecture that meets the requirements; add complexity only when justified.
- Contracts between apps/modules are explicit before parallel work begins.
- Security-relevant flows (auth, PII, payments) get first-class treatment (`security-review`).

## Rules

- Consistent with the approved stack — no new stack decisions here.
- Record decisions and rejected alternatives (the "why").
- No code; this is design.

## Anti-Patterns

- Over-engineering (microservices/event buses for a small app).
- Under-defining contracts, then parallelizing into conflicts.
- Architecture that contradicts the approved stack.

## Validation Checklist

- [ ] Module/service boundaries defined.
- [ ] Data flow and ownership defined.
- [ ] Integration points + contracts identified.
- [ ] Cross-cutting concerns decided.
- [ ] Proportional to the request.
- [ ] Decisions + alternatives recorded (Gate 3).

## Definition of Done

A recorded architecture consistent with the approved stack — boundaries, data flow, integrations, and cross-cutting concerns — sufficient to generate phases, tasks, and the repository layout.

## Related Skills

`stack-recommendation`, `repository-architecture`, `task-planning`, `security-review`, `testing-strategy`, `project-orchestrator`.

## Related Knowledge

`../../knowledge/` (architecture decision records, domain model).

## Related References

`../../references/<architecture-topic>/` when a pattern needs grounding.

## Context Loading Guidance

- **Requires:** approved apps/stack, requirement baseline.
- **Does not require:** full source, unrelated references, implementation skills.
- **May load:** `repository-architecture`, `security-review` for sensitive flows.
- **Stop when:** the architecture is recorded and passes Gate 3.

## Token Efficiency Guidance

Work from summaries of apps/stack/requirements. Capture the design as concise decisions + a diagram-in-text; avoid restating stack rationale already recorded.
