---
name: documentation
description: Use to write or update documentation of the work inside `.ai/` — decisions, project state, work items, knowledge, generated reports — concisely and in its canonical place. For the applications' own documentation (the `docs/` tree), use `application-documentation` instead.
---

# Documentation

## Purpose

Produce and maintain documentation of **the work** — placed canonically, kept concise, and never duplicated. Implements `../../system/DOCUMENTATION_RULES.md`.

Scope: everything under `.ai/`. The **applications' own documentation** — the `docs/` tree with a folder per app and a file per screen, page, endpoint, or job — belongs to `application-documentation`. Both are needed; neither restates the other.

## When to Use

- Recording decisions, project state, work items, knowledge, or reports.
- Updating READMEs/indexes when structure changes.
- **Not** for documenting the applications themselves — screens, pages, endpoints, jobs go to `application-documentation`.
- **Not** to pad output with narration or restate canonical rules.

## Inputs

- The fact/decision/state to document and its canonical home.
- Existing docs that may already cover it.

## Discovery Questions

- Is this canonical (`../../system/`), project state (`../../projects/current/`), knowledge (`../../knowledge/`), or generated (`../../generated/`)?
- Or is it a fact about the built product? Then it is `docs/`, not `.ai/` — hand to `application-documentation`.
- Does a doc already cover this (update vs create)?
- Who reads this next, and what do they need?

## Responsibilities

- Place docs in the **correct canonical location** (see the map in `DOCUMENTATION_RULES.md`).
- Keep **adapters thin** — link to `.ai/`, never duplicate it.
- Record **decisions and their reasons** (including rejected alternatives).
- Keep progress/task notes **concise** (status, decisions, links).
- Update relevant **indexes** (e.g. `../README.md`) when adding entries.
- **Archive** stale generated content (`../../generated/`).

## Required Workflow

1. Identify the canonical home.
2. Check for an existing doc to update.
3. Write concisely; capture the "why."
4. Update the relevant index.
5. Archive superseded generated docs.

## Decision Rules

- Single source of truth: document once, link elsewhere.
- Update over duplicate; delete/correct stale over contradict.
- Generated reports are archivable, not permanent context.

## Rules

- No duplication of system rules into adapters or other docs.
- No secrets/unredacted PII in any doc (`../../system/SECURITY_RULES.md`).
- Write for reload: self-locating, with links.

## Anti-Patterns

- Fat adapters restating the system.
- Verbose progress logs that bury the decision.
- Duplicate docs that drift out of sync.
- Long code examples in permanent skills (use `../../references/` / `../../templates/`).

## Validation Checklist

- [ ] Correct canonical location.
- [ ] Concise; decisions + reasons recorded.
- [ ] No duplication of canonical content.
- [ ] Index updated.
- [ ] Stale generated docs archived.
- [ ] No secrets/PII.

## Definition of Done

Documentation placed canonically, concise, non-duplicative, with decisions and reasons recorded, indexes updated, and stale generated content archived.

## Related Skills

`application-documentation` (the `docs/` half), `project-orchestrator`, `code-review`, `final-quality-audit`, and any skill producing records.

## Related Knowledge

`../../knowledge/` (where durable knowledge lands).

## Related References

`../../references/` structure conventions.

## Context Loading Guidance

- **Requires:** the item to document and its canonical home.
- **Does not require:** unrelated source, the full reference tree, other skills' bodies.
- **May load:** the target index/README to update.
- **Stop when:** the doc + index are updated and stale content archived.

## Token Efficiency Guidance

Write the minimum that serves the next reader. Link rather than paste. Summarize source into decisions.
