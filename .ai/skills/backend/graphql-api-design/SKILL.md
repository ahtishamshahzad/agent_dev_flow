---
name: graphql-api-design
description: Use to decide whether GraphQL fits and to design a GraphQL API — schema/type design, resolvers, N+1 protection (dataloaders), pagination (connections), mutations/errors, query cost limits, and field-level authorization.
---

# GraphQL API Design

## Purpose

Evaluate GraphQL against the project's needs and, if chosen, design the schema, resolver strategy, N+1 protection, pagination, and security limits — as a contract, not code.

## When to Use

- When clients need flexible, nested data selection (multiple frontends with divergent data needs).
- **Not** when a straightforward REST surface serves the clients — evaluate first, don't assume.

## Inputs

- Domain model, client list and their data-shape needs.
- Auth model (`backend-authentication`, `backend-authorization`).

## Discovery Questions

- Do clients genuinely need flexible selection/nesting, or would a few REST endpoints do?
- What are the deepest/heaviest queries clients will run?
- Who may introspect the schema in production?

## Responsibilities

- **Fit decision first:** GraphQL earns its complexity with multiple clients needing different shapes of the same graph; otherwise recommend REST (`rest-api-design`).
- Design the schema from the **domain graph**, not the database tables; nullable vs non-null deliberately.
- Plan resolver data loading with **dataloaders/batching** — N+1 is the default failure, design against it explicitly.
- Use **connection-style pagination** for lists; no unbounded list fields.
- Design mutations with typed payloads including user-facing errors; transport errors stay in the errors array.
- Set **query depth/cost limits**, disable production introspection unless required, and plan **field-level authorization** (`backend-authorization`) — the resolver is the enforcement point.
- Document the unit as it is built — the schema/resource files under `docs/<app>/api/` (`../../application-documentation`).

## Required Workflow

1. Make and record the GraphQL-vs-REST fit decision.
2. Model the schema from the domain graph.
3. Plan resolvers + dataloader boundaries for every relation.
4. Define pagination, mutation, and error conventions.
5. Set cost/depth limits and authorization per field/resolver.
6. Record the schema design in the API contract.

## Decision Rules

- One client with fixed screens rarely justifies GraphQL.
- Every relation resolver gets a batching strategy or a recorded reason it doesn't need one.
- Authorization is enforced **per resolver/field** — a query reaching a resolver proves nothing (`ownership-authorization`).
- Public APIs get persisted queries or cost limits; never unlimited anonymous query shapes (`rate-limiting`).

## Rules

- Schema evolves additively; deprecate fields, don't break them (`api-contracts`).
- No resolver reads another domain's tables directly (`backend-api-architecture`).
- Errors never leak internals (`backend-error-handling`).

## Anti-Patterns

- Adopting GraphQL for one client "to be modern."
- Schema mirroring database tables 1:1.
- Relation resolvers issuing per-item queries (N+1).
- Authorization only at the query root, leaving nested fields open.
- Unbounded lists and unlimited query depth on public endpoints.

## Validation Checklist

- [ ] Fit decision recorded (GraphQL justified over REST).
- [ ] Schema modeled from the domain graph; nullability deliberate.
- [ ] Dataloader/batching plan per relation.
- [ ] Connection pagination on all lists.
- [ ] Depth/cost limits + introspection policy set.
- [ ] Field/resolver-level authorization planned.

## Definition of Done

A recorded fit decision and, if GraphQL, a schema + resolver design with N+1 protection, pagination, limits, and resolver-level authorization — registered in the API contract.

## Related Skills

`rest-api-design`, `api-contracts`, `backend-authorization`, `ownership-authorization`, `rate-limiting`, `backend-performance`, `../../database/database-performance`, `../../application-documentation`.

## Related Knowledge

`../../../knowledge/` (domain graph, client needs).

## Related References

`../../../references/backend/api/` (schema conventions, when populated).

## Context Loading Guidance

- **Requires:** domain model, client data-shape needs, auth model summary.
- **Does not require:** database internals, resolver implementations.
- **May load:** `api-contracts`, `backend-authorization`.
- **Stop when:** the fit decision (and schema design, if chosen) is recorded.

## Token Efficiency Guidance

Decide fit from the client-needs summary before designing anything. Express the schema as type sketches, not full SDL dumps.
