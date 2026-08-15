---
name: backend-api-architecture
description: Use to define the internal architecture of a backend API — layering (transport/controllers/services/data), domain boundaries, where cross-cutting concerns live, and how modules communicate. Framework-agnostic; foundations apply it per framework.
---

# Backend API Architecture

## Purpose

Define how the backend is organized internally — layers, domain boundaries, dependency direction, and homes for cross-cutting concerns — so every feature lands in a predictable place regardless of framework.

## When to Use

- After the stack decision, before or alongside the foundation skill.
- When an existing backend's structure is being reworked (`../../refactor-planning`).
- **Not** for the external API shape — that's `rest-api-design` / `graphql-api-design`.

## Inputs

- Architecture design (`../../architecture-design`) and domain list.
- Chosen framework (`backend-stack-selection`) and data layer (`../../database/`).

## Discovery Questions

- What are the domains, and which depend on which?
- Where must transactions and authorization be enforced (service layer, typically)?
- What is shared across domains (auth context, errors, config, utilities)?

## Responsibilities

- Define layers and dependency direction: **transport (routes/controllers) → services (business rules) → data layer**; lower layers never import upward.
- Draw **domain boundaries**; cross-domain calls go through service interfaces, not each other's tables.
- Place cross-cutting concerns: validation at the edge (`backend-validation`), authorization at the edge + service (`backend-authorization`), transactions in services (`../../database/transactions`), errors centrally (`backend-error-handling`).
- Define DTO/model separation: transport shapes ≠ database entities (`api-contracts`).
- Document the unit as it is built — `docs/<app>/README.md` and the per-resource files under `docs/<app>/api/` (`../../application-documentation`).

## Required Workflow

1. List domains and their dependencies; break cycles by extracting shared concepts.
2. Fix the layer rules and dependency direction.
3. Assign each cross-cutting concern a single home.
4. Define transport-vs-entity mapping rules.
5. Record the architecture for the foundation skill to apply.

## Decision Rules

- Business rules live in **services** — testable without HTTP.
- A domain owns its data access; other domains ask its service.
- Controllers stay thin: parse/validate → call service → map result to response.
- Start modular-monolith; extract services only under real scaling/ownership pressure (`../../architecture-design`).

## Rules

- One home per concern — no validation/authz scattered across layers ad hoc.
- Never return database entities directly from the transport layer.
- Record deviations explicitly; silent exceptions rot the architecture.

## Anti-Patterns

- Fat controllers / anemic services.
- Domain A querying domain B's tables directly.
- Circular service dependencies.
- "Utils" folders accumulating business logic.

## Validation Checklist

- [ ] Layers + dependency direction defined.
- [ ] Domain boundaries drawn; cross-domain access via services.
- [ ] Cross-cutting concerns each assigned one home.
- [ ] DTO/entity separation defined.
- [ ] Recorded for the foundation skill.

## Definition of Done

A recorded internal architecture — layers, boundaries, concern placement, mapping rules — that the foundation skill can apply and reviewers can enforce.

## Related Skills

`../../architecture-design`, `express-foundation`, `nestjs-foundation`, `rest-api-design`, `api-contracts`, `backend-validation`, `backend-authorization`, `backend-error-handling`, `../../database/transactions`, `../../application-documentation`.

## Related Knowledge

`../../../knowledge/` (domain model, boundary decisions).

## Related References

`../../../references/backend/` (architecture notes, when populated).

## Context Loading Guidance

- **Requires:** domain list, stack decision, architecture summary.
- **Does not require:** endpoint-level detail, framework docs, other packs.
- **May load:** one foundation skill, `api-contracts`.
- **Stop when:** the internal architecture is recorded.

## Token Efficiency Guidance

Work at boundary altitude — a dependency table and layer rules, not code. Delegate endpoint shape to the API-design skills.
