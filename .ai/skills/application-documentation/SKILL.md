---
name: application-documentation
description: Use to place and maintain the documentation of the applications being built — the `docs/` tree, one folder per app, indexed at every level, with a file per screen, page, endpoint, or job. Distinct from `.ai/`, which holds plans and system rules, not product documentation. Docs ship with the change that causes them.
---

# Application Documentation

## Purpose

Give the software being built a predictable documentation home: one `docs/` tree, one folder per application, a README index at every level, and one file per documented unit (screen, page, endpoint, job, table). So that "where does this go?" has a single answer, and a reader can find any app's documentation without asking.

Implements the application half of `../../system/DOCUMENTATION_RULES.md`. The `.ai/` half — plans, decisions, work items, generated reports — belongs to `documentation`.

## When to Use

- The moment a project has more than one application (mobile + backend + admin …), or will.
- When a screen, page, endpoint, job, or table is added or changed — the doc moves in the same task.
- When adopting the system into an existing repo that already has scattered docs.
- **Not** for planning artifacts, gate records, or audits — those are `documentation` → `../../projects/current/`.

## Inputs

- Selected applications and their types (`application-selection`).
- Repository layout — single repo or monorepo (`repository-architecture`).
- Existing documentation conventions, if the repo has any (`existing-project-audit`).

## Discovery Questions

- Which applications exist, and what is each one's type (mobile, web, dashboard, backend, service)?
- Does the repo already document anything, and where? (Match it before replacing it.)
- Is documentation published anywhere (site, wiki, package registry) that constrains the layout?
- Which units are worth a file of their own, and which are a section in a parent doc?

## The structure

One `docs/` directory at the repository root, whatever the repo strategy:

```
docs/
├── README.md                    # index: the applications, what each is, where its docs live
├── architecture/                # cross-application
│   ├── README.md
│   ├── overview.md              # system shape, how the apps relate
│   ├── data-flow.md
│   └── decisions/               # ADRs — one per decision, dated
├── mobile/
│   ├── README.md                # purpose, stack, how to run, where things live
│   ├── screens/
│   │   ├── README.md            # screen index — the map of the app
│   │   └── login.md             # one file per screen
│   ├── navigation.md
│   └── state.md
├── admin/
│   ├── README.md
│   └── pages/
│       ├── README.md
│       └── login.md
├── web/
│   └── … same shape as admin
└── backend/
    ├── README.md
    ├── api/                     # one file per resource or endpoint group
    │   ├── README.md
    │   └── auth.md
    ├── database/                # schema notes, one per area
    └── jobs/                    # one per job
```

**Per-application subfolders follow the application's type** — they are not invented per project:

| App type | Unit folders |
|----------|--------------|
| Mobile | `screens/`, plus `navigation.md`, `state.md`, `native.md` as needed |
| Web / dashboard | `pages/`, plus `components.md`, `state.md`; dashboards may add `reports/` |
| Backend / service | `api/`, `database/`, `jobs/`, `integrations/` |
| Shared package | a single `README.md` unless it grows units of its own |

**Naming.** `kebab-case`, matching the real route, screen, or resource name — `login.md` for the `Login` screen, `password-reset.md` for `/auth/password-reset`. The filename is how a reader finds it; make it the name they already know.

**Every folder has a `README.md` that indexes its children.** A folder without an index is a folder nobody reads.

## `docs/` is not `.ai/`

The distinction that keeps both useful:

| Question | Home |
|----------|------|
| What are we going to build, and why did we choose it? | `../../projects/current/` (plans, decisions, gate status) |
| What is this unit of work? | `../../work-items/` |
| What does the built thing do, and how do I use it? | `docs/` |
| What are the rules the agent follows? | `../../system/` |
| Reference material feeding the work | `../../references/<topic>/` |

A stack recommendation is a plan → `.ai/`. The resulting "the mobile app uses Expo, run it with `pnpm mobile`" is product documentation → `docs/mobile/README.md`. Never write the same fact in both; link from the plan to the doc once the thing exists.

## Responsibilities

- **Create the tree from the selected applications** — one folder per app, named as the app is named in `repository-architecture`, not renamed for docs.
- **Write the unit file in the same task as the code.** A screen without `docs/<app>/screens/<screen>.md` is an incomplete task, not a follow-up.
- **Update the index** when adding a unit — the parent `README.md` gains a row.
- **Update the doc when behavior changes.** A doc that contradicts the code is a defect, reported like any other (`code-review`).
- **Match an existing repo's conventions** before imposing this one; if it already uses `documentation/` or `doc/`, keep its name and apply the shape inside it.
- **Keep each unit doc short**: what it is, how to reach it, what it needs, what it does, what can go wrong. Link to code; don't paste it.
- **Delete docs for deleted units** in the same change.

## Required Workflow

1. Read selected applications + repo layout.
2. Create `docs/` with `README.md` and one folder per application.
3. Add the type-appropriate unit folders per app, each with an index README.
4. As each unit is built, write its file and add it to the parent index.
5. On change, update the file; on deletion, remove it and its index row.
6. Check at review that docs match the change (`../../checklists/code-review.md`).

## Decision Rules

- **A unit gets its own file** when it has its own route, its own screen, or its own contract. Otherwise it's a section in the parent.
- **One `docs/` at the root**, even in a monorepo — per-package `README.md` files stay, but per-package `docs/` trees fragment the map. Exception: a package published independently owns its own docs.
- **Existing conventions win** over this structure in an established repo; apply the shape within their names.
- **If the doc would only restate the code, don't write it** — document the contract, the reason, and the failure modes, not the implementation line by line.

## Rules

- No secrets, tokens, credentials, real user data, or unredacted PII in any doc (`../../system/SECURITY_RULES.md`).
- Environment variables appear as **names and purposes**, never values.
- Docs describe what exists. Planned work stays in `../../work-items/` until it is real.
- Screenshots and diagrams live beside the doc that uses them, not in a global dumping folder.

## Anti-Patterns

- Docs written "at the end of the phase" — they are written with the change or not at all.
- A `docs/` tree with no README indexes: findable only by `ls`.
- Per-package `docs/` folders in a monorepo, so the reader must know where to look first.
- Documenting every component and helper; documenting no screen or endpoint.
- Copying plan content out of `.ai/projects/current/` into `docs/`, where it immediately drifts.
- Folder names invented per app (`views/` here, `screens/` there) for the same app type.

## Validation Checklist

- [ ] `docs/` exists at the repo root with a top-level `README.md` listing every application.
- [ ] One folder per application, named as the app is named in the repo.
- [ ] Unit folders match the app type (screens / pages / api / jobs …).
- [ ] Every folder has a `README.md` index; every unit file appears in its parent index.
- [ ] Filenames are `kebab-case` and match the real route/screen/resource names.
- [ ] Units added in this change have docs; units removed have theirs deleted.
- [ ] No secrets, credentials, or unredacted PII; env vars are names only.
- [ ] No plan content duplicated from `../../projects/current/`.

## Definition of Done

A `docs/` tree whose shape can be predicted without reading it: one folder per application, type-appropriate unit folders, an index at every level, one file per screen/page/endpoint/job named after the thing it documents — current with the code as of this change.

## Related Skills

`documentation` (the `.ai/` half), `repository-architecture` (places `docs/` in the layout), `application-selection` (what apps exist), `existing-project-audit` (conventions already in place), `code-review` (docs-match-change is a review item), `final-quality-audit`.

## Related Knowledge

`../../knowledge/` (domain terms the docs should use consistently).

## Related References

`../../references/` — reference *material* feeding the work, distinct from the product docs this skill places.

## Context Loading Guidance

- **Requires:** the application list, the repo layout, and the unit being documented.
- **Does not require:** the whole source tree, unrelated app folders, planning history.
- **May load:** the parent index README being updated.
- **Stop when:** the unit's doc and its index row are written.

## Token Efficiency Guidance

Write the unit doc from the contract — route, inputs, behavior, failure modes — not by reading the whole implementation. Link to source paths instead of pasting code. Update one index row, not the whole index.
