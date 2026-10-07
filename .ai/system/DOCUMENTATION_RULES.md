# Documentation Rules

Where things get written, how much, and how to keep it lean. Documentation serves the next agent and the user — not archival volume.

Two trees, two jobs. **`.ai/` holds the work**: rules, plans, decisions, work items, reports. **`docs/` holds the product**: what the applications are and how to use them. A fact belongs to exactly one of them.

## Where documentation lives

| Content | Location |
|---|---|
| System rules (canonical) | `../system/` |
| Active project state, decisions, phases | `../projects/current/` |
| Roadmap, weekly plans, status, logs, reports, meetings | `../projects/current/` (`PROJECT_MANAGEMENT_RULES.md`) |
| Work items (features/bugs/refactors/audits/migrations) | `../work-items/` |
| Durable, reusable decisions | `../memory/` |
| Domain/architecture knowledge for current work | `../knowledge/` |
| External-facing reference material | `../references/<topic>/` |
| Reusable templates | `../templates/` |
| Reusable checklists | `../checklists/` |
| Generated reports/audits (archivable) | `../generated/` |
| **Application documentation** (screens, pages, endpoints, jobs) | **`docs/` at the repo root** — see `../skills/application-documentation` |

## Application documentation (`docs/`)

The software being built documents itself in one `docs/` tree at the repository root: one folder per application, unit folders matching the application's type (`screens/`, `pages/`, `api/`, `jobs/`), a `README.md` index at every level, and one file per unit named after the route or screen it documents. Full structure and rules: `../skills/application-documentation`; unit template: `../templates/APP_DOC.md`.

- **Docs ship with the change.** A screen without its doc is an incomplete task, not a follow-up.
- **A doc that contradicts the code is a defect**, reported at review like any other.
- **Don't copy plans into `docs/`.** `../projects/current/` says what we decided and why; `docs/` says what exists. Link, never duplicate.
- **Existing conventions win.** In an established repo, keep its documentation folder name and apply the shape inside it.

## Principles

- **Single source of truth.** Document a fact once, in its canonical place; link to it elsewhere.
- **Adapters stay thin.** `AGENTS.md`, `CLAUDE.md`, and editor rules point into `.ai/`; they never duplicate it.
- **Concise over complete.** Progress and task notes carry status, decisions, and links — not narration (`TOKEN_OPTIMIZATION_RULES.md`).
- **Write for reload.** Assume a future agent reads only this file plus its links; make it self-locating.
- **Record decisions and their reasons**, especially trade-offs and rejected alternatives — future agents need the "why."

## Generated content lifecycle

- Agent/tool-generated reports, audits, and checklists go to `../generated/`.
- When a report is no longer active, **archive it** (move to an archive subfolder or mark archived) so it stops consuming context.
- Keep only currently-relevant generated content in the live path.

## Keep it current

- Update `../projects/current/` as gates pass and phases advance.
- Update `CHANGELOG.md` for changes to **this system**; application changelogs live in the application, not here.
- Remove or correct stale docs rather than letting them contradict the code.

## What not to document here

- Application source, dependencies, or stack choices as if they were system rules — those belong to the project the system builds.
- Long code examples inside permanent skills (put them in `../references/` or `../templates/`).
