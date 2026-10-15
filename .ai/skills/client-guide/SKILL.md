---
name: client-guide
description: Use when a client-facing guide to an existing product is wanted — a complete, non-technical, screenshot-backed explanation of every user type, screen, workflow, and admin/CMS module, built from the running application. Asks the blocking questions first, explores the real app, captures genuine screenshots, then produces the Markdown guide and, if requested, a PDF, a presentation artifact, and a separate end-user guide. Documents what exists; never invents.
---

# Client Guide

## Purpose

Turn a **running product** into a package a non-technical client can read without a developer: what the product is, who uses it, and how every workflow works — shown with real screenshots. One run, whole project.

This is **product and user-flow documentation, not a developer handover**. It differs from `application-documentation` (per-screen reference for the team, in `docs/`) and `documentation` (the `.ai/` record). It may read their output, never restates it.

## When to Use

- A client, stakeholder, or buyer must understand the product as it exists today.
- Handover, launch, onboarding of a customer's staff, or a sales/acceptance review.
- The product has a reachable running build (local, staging, or approved test environment).
- **Not** for planned features, API/architecture docs, or code audits.

## Inputs

- The running application(s) and an **approved test environment** with safe test accounts (one per user role).
- `.ai/projects/current/` and the repo's existing docs / artifacts conventions.
- The answers to the questions below.

## Discovery Questions (ask first — before any exploring or writing)

Ask these in one message, with a recommended default for each so the user can answer "defaults". Do not start work until answered or defaults are confirmed.

1. **Product and audience** — Which product, and who reads this (client owner, their staff, end users)? Their technical level?
2. **Environment** — Where does the app run (URLs, build, simulator/device), and which test accounts exist per role? Are any surfaces unreachable (e.g. a mobile build, payment, email)?
3. **Surfaces and roles in scope** — Mobile, desktop, web, CMS/admin, company/team features? Any role or area to exclude?
4. **Formats** — Markdown guide with screenshots is always produced. Also wanted: **PDF**? **Presentation artifact**? **Separate end-user guide**? (Default: Markdown only.)
5. **Branding and language** — Client name/logo, tone, language, length preference? Anything confidential to obscure beyond passwords and tokens?
6. **Output location** — Default: the repo's existing artifacts/docs convention; else `docs/client-guide/`. Confirm.

State the assumptions you proceed on if an answer is missing. Environment gaps become entries in the limitations list, not silent omissions.

## Required Workflow

1. **Ask** the discovery questions; record answers and assumptions (confirmed / assumptions / questions).
2. **Locate conventions** — existing artifacts/docs folder, naming, any prior guide. Match them (`application-documentation`).
3. **Inventory the product** from the app, not the code: surfaces, navigation, roles, settings, integrations. Write a coverage checklist of every screen, menu, tab, modal, form, and action found. Read code or configuration only to find routes, roles, and labels; never to describe behavior you did not observe.
4. **Drive the real app** (browser or simulator; `run` / `playwright-e2e` / `maestro-e2e` for the mechanics) with safe test data. Walk each workflow per role: start screen → navigation → form → action → result, including errors and restricted access. Do not modify product behavior.
5. **Capture screenshots as you go** — one per step that matters, per role where the interface differs. Name them meaningfully (`individual-03-create-account-form.png`), keep them beside the guide that uses them, obscure secrets and personal data, and check each is readable.
6. **Write the guide** for the audience (below). Verify each written step against what you saw.
7. **Produce requested formats** — PDF and/or presentation from the finished Markdown, using the Artifact tool or the project's existing convention; a separate end-user guide with only the end-user roles' content.
8. **Review** against the checklist; fix gaps; list limitations and open questions.
9. **Hand over** a short summary: location, sections, roles and surfaces covered, screenshot count, unverified items, questions for the client.

## The Package

Under the confirmed location, `client-guide/`:

```
client-guide/
├── README.md                 # main document: product overview, how parts fit, who sees what, how to read this guide
├── <role-or-area>.md         # one per user type / surface that exists (individual, company admin, employee, CMS admin …)
├── configuration.md          # themes, branding, settings — only if they exist
├── capture-and-media.md      # only if capture/media features exist
├── limitations-and-questions.md
├── coverage.md               # final overview: what is covered, by role and surface
└── screenshots/              # real captures, meaningful filenames
```

**Sections are discovered, not templated.** Create a file only for what exists; the names above are examples. Add files for anything found that fits none of them.

## Writing Rules

- Plain, professional English; explain every term the first time; use the **actual labels** shown in the app.
- Per feature: what it is for, numbered steps, what the user sees next, restrictions, alternative outcomes (errors, no access).
- Distinguish roles clearly; where two roles see different screens, show both.
- Screenshot beside its step, with a caption saying what it demonstrates.
- Cross-link related workflows.
- No code, endpoints, schemas, repo structure, setup steps, or infrastructure.

## Decision Rules

- If a workflow cannot be reached or verified → say so in `limitations-and-questions.md`, with whether it is a **product limitation** or an **environment/testing limitation**. Never fabricate a screenshot or claim it works.
- If a feature is in code but not reachable in the app → record as unverified; do not describe it as available.
- If a screen is planned or stubbed → list as "not yet available" or omit with a note; never present it as working.
- If behavior is ambiguous → record a question for the client; do not guess a business rule.
- If a real record, token, or password would appear → use test data or obscure it before saving.
- If the convention already has an artifacts location → use it; do not invent a structure.

## Rules

- Document the product as it is today. No planned functionality, no idealized flows.
- Screenshots are genuine captures. No mockups, edits that change content, or re-drawn screens; redaction only.
- Test data only; no secrets, tokens, or private customer information (`../../system/SECURITY_RULES.md`).
- Do not change application code or data to make the guide easier; test-data changes made through the product are fine.
- Do not commit or push without approval (`../../system/GIT_WORKFLOW_RULES.md`).

## Anti-Patterns

- Writing from the first few screens or from the code, then "filling in" the rest.
- Mockups or imagined screens standing in for captures.
- A developer handover in client clothing: routes, tables, components, setup.
- Silent omissions — inaccessible areas not mentioned anywhere.
- One generic "admin" section when the CMS has distinct modules.
- Screenshots dumped in one folder, uncaptioned, named `image1.png`.
- Starting before the formats, roles, and environment are confirmed.

## Validation Checklist

- [ ] Discovery answers (or confirmed defaults) recorded; assumptions listed.
- [ ] Coverage checklist exists and every item is documented or listed as a limitation.
- [ ] Every user type and surface in scope has its own section.
- [ ] Every CMS/admin module explored: purpose, who uses it, data shown, actions, search/filter, results, limits.
- [ ] Major workflows: start screen, navigation, form, action, result — each with a screenshot.
- [ ] Screenshots genuine, readable, captioned, named meaningfully, placed beside the steps; secrets obscured.
- [ ] Written steps verified against the running app; labels match.
- [ ] Roles with different interfaces have separate screenshots.
- [ ] Limitations and open questions listed; product vs environment limits distinguished.
- [ ] No code, endpoints, schemas, or setup detail in the guide.
- [ ] Requested extra formats produced (PDF / presentation / end-user guide) and match the Markdown.
- [ ] `coverage.md` states what the guide covers and what it does not.

## Definition of Done

A navigable package in the agreed location: a main document, one section per real user type and surface, configuration and media sections where they exist, real captioned screenshots beside the steps, a limitations-and-questions list, a coverage overview, and any requested PDF, presentation, or end-user guide — every claim verified against the running product or marked unverified.

## Related Skills

`application-documentation`, `documentation`, `playwright-e2e` / `maestro-e2e` (driving the app), `test-data-management`, `test-environment-management`, `ai-output-review` (no invented facts), `privacy-review` (what to obscure), `final-quality-audit`.

## Related Knowledge

`../../knowledge/` (domain terms for consistent wording).

## Related References

None required.

## Context Loading Guidance

- **Requires:** the answers, the running app, existing docs conventions.
- **Does not require:** source code beyond finding routes/roles/labels, planning history, other skills' bodies.
- **May load:** `application-documentation` (placement), `playwright-e2e`/`maestro-e2e` (driving).
- **Stop when:** the package is reviewed and handed over.

## Token Efficiency Guidance

Keep the coverage checklist as the single source of progress; write each section right after its workflow is captured, then discard the working notes. Use screenshots as evidence, not as text to re-describe. Delegate per-role exploration to parallel agents only with one shared checklist and filename convention (`../../system/MULTI_AGENT_RULES.md`).
