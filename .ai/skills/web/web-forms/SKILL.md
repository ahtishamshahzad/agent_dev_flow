---
name: web-forms
description: Use to plan web forms — React Hook Form (or framework-native alternatives), Zod schema validation at the edges, accessible inline error UX, submit states, and multi-step flows; on Next.js, whether server actions handle submission. Client validation is UX; the server enforces.
---

# Web Forms

## Purpose

Plan form architecture: form state handling, schema validation shared between client UX and server enforcement, accessible error presentation, and submission flow (including Next.js server actions where they fit). Form state stays local to the form.

## When to Use

- When planning any non-trivial form (signup, checkout, settings, admin editors).
- When an existing app hand-rolls form state or duplicates validation ad hoc.
- **Not** for the validation rules' business content (domain) or auth flows themselves (`web-authentication`).

## Inputs

- The forms inventory (fields, rules, dependencies between fields).
- Submission targets from `web-api-integration` (or server actions per `nextjs-foundation`).
- Design-system form primitives (`web-design-system`) and accessibility bar (`web-accessibility`).

## Discovery Questions

- Which forms exist, and which are complex (multi-step, dynamic fields, file upload)?
- Can one schema (e.g., Zod) serve client validation and server-side enforcement?
- (Next.js) Do submissions go through server actions or the API layer?
- What are the pending/disabled/success/error UX expectations?

## Responsibilities

- Select the **form library** (React Hook Form is the usual candidate; framework-native/uncontrolled approaches for simple cases) with justification.
- Define **schema validation** at the edges: schema-first (Zod or equivalent), reused server-side where the stack allows — **client validation is UX; the server is the authority**.
- Plan **error UX**: inline, per-field, announced accessibly (labels, `aria-describedby`, focus to first error), plus form-level errors from the server.
- Plan **submit states**: pending indication, double-submit prevention, success routing, server-error mapping back onto fields.
- Handle **special cases** deliberately: multi-step (state stays in the form flow, not global), file uploads (validate size/type client-side as UX; server re-validates), autosave where required.

## Required Workflow

1. Inventory forms; flag the complex ones.
2. Choose the form approach + schema layer with justification.
3. Define the validation contract (client UX + server enforcement) per form.
4. Specify error/submit UX against design-system primitives.
5. Record the plan; hand transport to `web-api-integration`.

## Decision Rules

- Schema-first: rules live in the schema, not scattered in component logic.
- One source of validation truth reused on both sides where possible; where not, the server's rules win and the client mirrors them.
- Form state is local (`web-state-management`) — a global store holding form drafts needs strong justification.
- Server actions are a fit for straightforward Next.js submissions; interactive/optimistic flows may still want the client query layer (`web-server-state`).

## Rules

- Every input has a programmatically associated label and error text (`web-accessibility`).
- The server re-validates everything, always — client checks are bypassable.
- No sensitive values echoed into logs or error reports from form handling.

## Anti-Patterns

- Validation logic duplicated with drift between client and server.
- Disabling the submit button as the only guard against invalid/double submission.
- Global-store form state producing app-wide re-renders per keystroke.
- Error messages only as red borders or toasts — invisible to screen readers.

## Validation Checklist

- [ ] Forms inventoried; complex flows identified.
- [ ] Form library/approach chosen with justification.
- [ ] Schema validation contract defined; server enforcement confirmed authoritative.
- [ ] Accessible error + submit-state UX specified.
- [ ] Multi-step/upload cases planned where present.

## Definition of Done

A recorded forms plan — library choice, schema contract with server-side enforcement, accessible error/submit UX, and handling for complex flows — implementable uniformly across the app.

## Related Skills

`web-api-integration`, `web-server-state`, `web-accessibility`, `web-design-system`, `web-state-management`, `web-authentication`, `dashboard-bulk-operations`.

## Related Knowledge

`../../../knowledge/` (domain validation rules).

## Related References

`../../../references/web/forms/` (schema/error patterns — when populated).

## Context Loading Guidance

- **Requires:** forms inventory, submission targets, design-system primitives.
- **Does not require:** full app source, unrelated data-layer detail.
- **May load:** `web-accessibility` for error-UX criteria; `web-api-integration` for submission transport.
- **Stop when:** the forms plan is recorded.

## Token Efficiency Guidance

Plan per form as a compact row: fields → schema → submit target → error UX. Push reusable patterns to references instead of restating per form.
