# `.ai/references/` — External-Facing Reference Material (Index)

Reference material organized by **topic folder**. Agents read only the relevant folder for the active task (`../system/CONTEXT_MANAGEMENT_RULES.md`, `../system/TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree.

## Structure

```
references/
└── <topic>/          # one folder per topic (e.g. api-design, mobile, security)
    └── *.md
```

## Index

Topic folders are added as needed.

| Topic folder | Covers | Read when |
|--------------|--------|-----------|
| [`mobile/`](mobile/) | Mobile examples/patterns: `screens/`, `navigation/`, `forms/`, `state/`, `native/`, `notifications/` (populated as projects develop). | Working on mobile tasks via `../skills/mobile/` skills. |
| [`web/`](web/) | Web/dashboard examples/patterns: `routing/`, `design-system/`, `forms/`, `state/`, `dashboard/`, `seo/`, `testing/` (populated as projects develop). | Working on web/dashboard tasks via `../skills/web/` skills. |

## Conventions

- One topic per folder; keep documents focused.
- Long code examples belong here (or `../templates/`), **not** in permanent skills.
- Register each topic folder in the index so it's discoverable without scanning.
- Prefer linking to canonical `.ai/` content over restating it.
