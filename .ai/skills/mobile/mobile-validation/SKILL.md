---
name: mobile-validation
description: Use to plan input/schema validation — Zod (or equivalent) schemas shared across forms and API boundaries, with clear error messages. Validate at the edges; reuse schemas. Client validation is UX, not security.
---

# Mobile Validation

## Purpose

Plan validation: define Zod (or equivalent) schemas for form input and API boundaries, produce clear errors, and reuse schemas across the client.

## When to Use

- Whenever user input or external data must be validated.
- Not as a replacement for server-side validation (client validation is UX, not security).

## Inputs

- Fields/data to validate and their rules.
- Form/API integration points (`mobile-forms`, `mobile-api-integration`).

## Discovery Questions

- What are the field rules (types, ranges, formats, required)?
- Can schemas be shared between forms and API parsing?
- What error messages does the UX need?

## Responsibilities

- Define **Zod (or equivalent) schemas** for inputs and API responses.
- Produce **clear, user-facing error messages**.
- **Reuse schemas** across forms and API boundaries.
- Coordinate with `mobile-forms` (resolver) and `mobile-api-integration` (response parsing).

## Required Workflow

1. Enumerate fields/data + rules.
2. Write schemas.
3. Wire schemas into forms + API parsing.
4. Define error messages.
5. Record the validation plan.

## Decision Rules

- Validate at the edges (form input, API responses); reuse one schema where possible.
- Client validation is UX — the server still validates for security (`../../security-review`).
- Keep messages user-friendly and specific.

## Rules

- Never treat client validation as a security control.
- Reuse schemas; avoid duplicate rule definitions.
- Coordinate with forms and API parsing.

## Anti-Patterns

- Client-only validation treated as security.
- Duplicated, drifting validation rules.
- Cryptic error messages.
- Validating in scattered ad-hoc checks.

## Validation Checklist

- [ ] Schemas defined for inputs/responses.
- [ ] Reused across forms + API.
- [ ] Clear error messages.
- [ ] Server-side validation noted as separate.
- [ ] Wired into forms/api-integration.

## Definition of Done

A recorded validation plan: reusable schemas at form and API edges with clear messages, wired into forms and response parsing — with server-side validation explicitly still required.

## Related Skills

`mobile-forms`, `mobile-api-integration`, `mobile-server-state`, `../../security-review`

## Related Knowledge

`../../../knowledge/` (data contracts).

## Related References

`../../../references/mobile/forms/` when populated.

## Context Loading Guidance

- **Requires:** fields/data + rules, form/API integration points.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-forms`, `mobile-api-integration`.
- **Stop when:** the validation plan is recorded.

## Token Efficiency Guidance

Plan from the rules list; share schemas rather than restating rules per screen.
