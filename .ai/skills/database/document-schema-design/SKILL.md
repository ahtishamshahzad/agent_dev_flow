---
name: document-schema-design
description: Use to design MongoDB document schemas — embed vs reference decided per access pattern, document identity and shape per collection, growth-bounded arrays, duplication with consistency ownership, and schema validation despite "schemaless."
---

# Document Schema Design

## Purpose

Design MongoDB collections around **how the data is read and written**: embed what's accessed together, reference what's shared or unbounded, and keep every duplication's consistency story explicit. "Schemaless" means the database doesn't force design — not that design is optional.

## When to Use

- After MongoDB is approved (`database-selection`), before implementation.
- When extending collections for a feature.
- **Not** for relational schemas (`relational-schema-design`) — and if this design keeps fighting for joins/transactions everywhere, escalate back to `database-selection`.

## Inputs

- Domain model + the **access patterns** (which data is read/written together, how often, by what key).
- Cardinalities and growth expectations per relationship.
- Tenancy/ownership model (`../../backend/ownership-authorization`).

## Discovery Questions

- For each relationship: is the child data always read with the parent (embed signal) or accessed independently/shared across parents (reference signal)?
- What are the array growth bounds — can any embedded list grow unbounded (order items: bounded; log entries: unbounded)?
- Which fields genuinely vary across documents (the MongoDB justification), and which are actually uniform?
- What must be atomic — single-document updates (natural) or cross-document (needs `transactions` and is a design smell in volume)?

## Responsibilities

- Decide **embed vs reference per relationship** from access patterns:
  - **Embed**: read/written as a unit with the parent, bounded size, not independently queried across parents.
  - **Reference**: shared entities, unbounded/large collections, independently accessed or updated data.
- Design document shape per collection: `_id` strategy, required core fields vs the genuinely variable part (name the variable part explicitly — a `attributes`/`payload` region, not chaos everywhere).
- Bound growth: **no unbounded embedded arrays** (16MB limit and rewrite cost are real) — bucket, paginate into child collections, or reference.
- Make **duplication deliberate**: denormalized snapshots (e.g. product name on an order) vs live references — each duplication has an update-propagation owner or an explicit "snapshot, never updated" ruling.
- Add **schema validation** (JSON Schema on collections and/or `mongoose-mongodb` schemas): required fields, types, enums — variability is scoped, not total.
- Keep single-document atomicity as the default write model; flag cross-document invariants to `transactions`.
- Tenancy: tenant key on every scoped document, in every query and index (`indexing`, `ownership-authorization`).
- Document the unit as it is built — `docs/<app>/database/` (collection notes per area) (`../../application-documentation`).

## Required Workflow

1. List entities, relationships, cardinalities, and the concrete access patterns.
2. Decide embed vs reference per relationship with the growth bound stated.
3. Draft collection shapes: core fields, variable regions, `_id`, tenant keys.
4. Record every duplication with its consistency story.
5. Define collection-level validation.
6. Hand off to `mongoose-mongodb` (or native driver plan) + `indexing`.

## Decision Rules

- Access patterns decide, not object-model aesthetics: model the queries, not the class diagram.
- If most relationships end up referenced and queries keep joining (`$lookup` everywhere), the domain is relational — say so (`database-selection`).
- Snapshot-vs-live is a business decision (does the old order show the old price?) — get it answered, don't guess.
- Unbounded growth → separate collection, no exceptions.

## Rules

- Every collection has written validation for its stable core.
- Every duplication is recorded with propagation-or-snapshot ruling.
- Cross-document atomic needs are flagged, not silently assumed.

## Anti-Patterns

- Designing documents as normalized tables (reference-everything) and re-implementing joins in app code.
- Unbounded embedded arrays (comments, events, logs inside a parent doc).
- "Flexible schema" as an excuse for undesigned, inconsistent field names/types across documents.
- Duplicated data with no owner — stale copies discovered by customers.
- Skipping validation because Mongo doesn't demand it.

## Validation Checklist

- [ ] Access patterns documented per entity.
- [ ] Embed/reference decided per relationship with growth bounds.
- [ ] Collection shapes: core vs variable regions, `_id`, tenant keys.
- [ ] Duplications recorded with consistency ownership.
- [ ] Collection validation defined.
- [ ] Cross-document atomicity needs flagged to `transactions`.

## Definition of Done

A recorded document design — per-relationship embed/reference decisions tied to access patterns, bounded shapes with validation, owned duplications, tenancy keys — ready for the data layer and indexing.

## Related Skills

`database-selection`, `mongoose-mongodb`, `indexing`, `transactions`, `concurrency`, `database-security`, `../../backend/ownership-authorization`, `data-migration` (reshaping later), `../../application-documentation`.

## Related Knowledge

`../../../knowledge/` (access patterns, snapshot rulings).

## Related References

`../../../references/database/schema/` (collection sketches, when populated).

## Context Loading Guidance

- **Requires:** domain model, access patterns with volumes, tenancy model.
- **Does not require:** Mongoose syntax, driver options, app code.
- **May load:** `mongoose-mongodb` (expression), `indexing` (query keys).
- **Stop when:** collection designs + duplication ledger are recorded.

## Token Efficiency Guidance

The relationship table (parent, child, access pattern, embed/reference, bound, duplication ruling) is the deliverable; example documents beat prose, one per collection.
