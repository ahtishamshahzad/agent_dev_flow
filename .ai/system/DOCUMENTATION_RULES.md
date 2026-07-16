# Documentation Rules

Where things get written, how much, and how to keep it lean. Documentation serves the next agent and the user — not archival volume.

## Where documentation lives

| Content | Location |
|---|---|
| System rules (canonical) | `../system/` |
| Active project state, decisions, phases | `../projects/current/` |
| Work items (features/bugs/refactors/audits/migrations) | `../work-items/` |
| Durable, reusable decisions | `../memory/` |
| Domain/architecture knowledge for current work | `../knowledge/` |
| External-facing reference material | `../references/<topic>/` |
| Reusable templates | `../templates/` |
| Reusable checklists | `../checklists/` |
| Generated reports/audits (archivable) | `../generated/` |

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
