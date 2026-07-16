---
name: mobile-forms
description: Use to plan form state and UX — React Hook Form (or equivalent) for form state, controlled inputs, submission, and error display — keeping form state out of global stores. Pairs with mobile-validation.
---

# Mobile Forms

## Purpose

Plan forms: manage form state with React Hook Form (or equivalent), handle inputs, submission, and error display — with validation delegated to `mobile-validation`.

## When to Use

- When a screen collects user input of any complexity.
- Not for a single trivial input needing only local state.

## Inputs

- The form's fields, submission target, and UX requirements.
- Validation rules (`mobile-validation`).

## Discovery Questions

- How many fields, and what interaction complexity?
- What is the submission target and its error shape?
- What are the accessibility and keyboard behaviors?

## Responsibilities

- Manage **form state** with a form library (React Hook Form or equivalent), not global state.
- Wire **controlled/uncontrolled inputs**, focus, and keyboard handling.
- Handle **submission**, loading, and **error display**.
- Delegate **validation** to `mobile-validation` (e.g. Zod resolver).
- Coordinate accessibility (`mobile-accessibility`).

## Required Workflow

1. Define fields + submission target.
2. Set up the form library + inputs.
3. Attach validation (delegate to `mobile-validation`).
4. Handle submit/loading/error UX.
5. Record the form plan.

## Decision Rules

- Form state stays in the form library, not Redux/Zustand.
- Validate via a schema resolver (`mobile-validation`), not scattered ad-hoc checks.
- Surface field- and form-level errors clearly and accessibly.

## Rules

- Keep form state local to the form.
- Delegate validation to `mobile-validation`.
- Handle keyboard/focus and accessibility.

## Anti-Patterns

- Form state in a global store.
- Ad-hoc validation scattered in handlers.
- No submission/loading/error handling.
- Ignoring keyboard/focus/accessibility.

## Validation Checklist

- [ ] Form library set up; fields defined.
- [ ] Validation delegated to `mobile-validation`.
- [ ] Submit/loading/error UX handled.
- [ ] Keyboard/focus + accessibility handled.
- [ ] Form state kept out of global stores.

## Definition of Done

A recorded form plan: library-managed form state, wired inputs and submission with error UX, schema validation via `mobile-validation`, and accessible keyboard/focus handling — no form state in global stores.

## Related Skills

`mobile-validation`, `mobile-state-management`, `mobile-accessibility`, `mobile-api-integration`, `mobile-server-state`

## Related Knowledge

`../../../knowledge/` (input requirements).

## Related References

`../../../references/mobile/forms/` when populated.

## Context Loading Guidance

- **Requires:** the form's fields, submission target, UX + validation rules.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-validation`, `mobile-api-integration`.
- **Stop when:** the form plan is recorded.

## Token Efficiency Guidance

Plan from the field list; delegate validation and transport to their skills.
