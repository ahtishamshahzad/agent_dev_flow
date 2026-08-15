---
name: relational-schema-design
description: Use to design a relational schema — entities to tables, keys, relationship modeling (1:1/1:N/M:N), constraints as integrity enforcement, appropriate types, normalization with justified denormalization, and soft-delete/audit/money conventions.
---

# Relational Schema Design

## Purpose

Turn the domain model into a relational schema whose **constraints enforce the business rules**: right tables, right keys, right relationships, right types — so invalid states are unrepresentable rather than policed by application code alone.

## When to Use

- After a relational database is approved (`database-selection`), before implementation.
- When extending the schema for a feature (`../../feature-planning`).
- **Not** for MongoDB (`document-schema-design`).

## Inputs

- Domain model: entities, relationships, invariants, lifecycle rules.
- Access patterns + reporting needs (shape indexing later — `indexing`).
- Tenancy/ownership model (`../../backend/ownership-authorization`).

## Discovery Questions

- What are the entities, their identities, and their relationships (with cardinality)?
- Which business rules are invariants the database should enforce (uniqueness, presence, ranges, exclusivity)?
- What is deleted vs retained (soft delete? audit history?), and what does money/time look like in this domain?

## Responsibilities

- Model tables per entity; **primary keys** deliberate (auto-increment vs UUID — external exposure and ordering trade-offs recorded; non-guessable IDs where enumeration matters, cf. `../../backend/ownership-authorization`).
- Model relationships explicitly: FKs for 1:N, join tables for M:N (with their own constraints), true 1:1 justified; **every FK with an `ON DELETE` decision** (cascade/restrict/set null — per relationship, not default).
- Enforce integrity in-schema: `NOT NULL` by default, `UNIQUE` for natural keys, `CHECK` for ranges/enums, FK constraints always on — "the app validates it" is not enforcement (`../../backend/backend-validation` is the UX layer; the schema is the floor).
- Choose types precisely: **integer minor units or `DECIMAL` for money (never float)**, `timestamptz`/UTC for time, native enums or lookup tables (recorded choice), text with sensible constraints.
- Normalize to ~3NF by default; **denormalize only for a measured/known access pattern, recorded with its consistency-maintenance story**.
- Set conventions once: naming (snake_case tables/columns, consistent id/created_at/updated_at), soft-delete pattern (and its unique-index interaction), audit/history tables where the domain demands them.
- Include the tenancy column strategy on scoped tables (org_id on every tenant row, indexed — feeds `ownership-authorization` query filters).
- Document the unit as it is built — `docs/<app>/database/` (schema notes per area) (`../../application-documentation`).

## Required Workflow

1. List entities, relationships, invariants from the domain model.
2. Draft tables + keys + relationship structures.
3. Push every enforceable invariant into constraints.
4. Fix types (money/time/enum decisions recorded).
5. Review against access patterns (flag hot joins to `indexing`).
6. Record the schema design for the data-layer skill (`prisma-relational`/`drizzle-relational`) and `database-migrations`.

## Decision Rules

- If a rule can be a constraint, it is one; application checks duplicate, not replace it.
- M:N always gets a join table with a composite unique — no comma-separated ID columns, no JSON arrays of FKs.
- JSON columns are for genuinely unstructured payloads on relational rows — not an escape hatch from designing relations.
- Soft delete only where the domain needs recover/history — and then partial/filtered unique indexes keep uniqueness honest.

## Rules

- No FK-less "relations by convention."
- Schema changes flow through `database-migrations` — design here, evolve there.
- Every denormalization has a written owner for keeping it consistent.

## Anti-Patterns

- Floats for money.
- Nullable-everything tables ("we'll tighten later").
- Entity-Attribute-Value tables for a known domain.
- Storing arrays of foreign IDs in a text/JSON column.
- Uniqueness "enforced" only by an application check (races — `concurrency`).
- One giant table with a `type` column absorbing every entity.

## Validation Checklist

- [ ] Tables/keys per entity; PK strategy recorded.
- [ ] All relationships explicit with FK + `ON DELETE` decisions.
- [ ] Invariants pushed into NOT NULL/UNIQUE/CHECK/FK constraints.
- [ ] Money/time/enum types correct and recorded.
- [ ] ~3NF; denormalizations justified with consistency story.
- [ ] Tenancy columns on scoped tables.
- [ ] Handed to data-layer + migrations skills.

## Definition of Done

A recorded relational schema — tables, keys, constrained relationships, precise types, enforced invariants, tenancy strategy — ready for the data-layer skill to express and migrations to apply.

## Related Skills

`database-selection`, `prisma-relational`, `drizzle-relational`, `database-migrations`, `indexing`, `transactions`, `concurrency`, `database-security`, `../../backend/ownership-authorization`, `../../application-documentation`.

## Related Knowledge

`../../../knowledge/` (domain invariants, retention rules).

## Related References

`../../../references/database/schema/` (ER sketches, when populated).

## Context Loading Guidance

- **Requires:** domain model with invariants, access patterns, tenancy model.
- **Does not require:** ORM syntax, migration tooling detail, app code.
- **May load:** `indexing` (hot-path flags), one data-layer skill for expression.
- **Stop when:** the schema design is recorded and handed off.

## Token Efficiency Guidance

An entity-relationship table (entity, keys, relations, constraints) carries the design; full DDL belongs to the data-layer/migration step, not here.
