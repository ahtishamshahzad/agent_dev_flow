# Technology Decision — <technology or "Baseline: project">

> Fill-in template. One form for a new project's **version baseline** and for adding, upgrading, or replacing technology in an existing project (`../system/TECHNOLOGY_GOVERNANCE_RULES.md`, `../skills/technology-governance`). Skip it for trivial dependencies.

- **Date:** <YYYY-MM-DD> · **Project:** new | existing · **Status:** proposed | approved (Gate 2 / work item) | superseded

## Baseline (new project)

| Area | Technology | Version (latest stable) | Verified how · when | Official docs (this version) | Requires |
|---|---|---|---|---|---|
| Runtime | <> | <LTS line / exact> | <registry / release page · date> | <link> | — |
| Framework | <> | <> | <> | <link> | <runtime ≥ …, peer deps> |
| <area> | <> | <> | <> | <> | <> |

- **Compatibility chain checked:** runtime → language → framework → libraries → data layer → build → test → deploy — <conflicts found and how resolved>
- **Not verified (from memory):** <items, or "none">

## Change (existing project)

- **Technology:** <name> · **Installed:** <exact, from lock file> · **Latest stable:** <exact>
- **Upgrade available:** yes | no · **Upgrade recommended:** yes | no
- **Trigger** (`../system/TECHNOLOGY_GOVERNANCE_RULES.md` §4): security · end of life · required feature · compatibility · deprecation · performance · compliance · none
- **Reason:** <the concrete engineering reason — or why the current version stays>
- **Breaking changes / migration work:** <from the official migration guide — link>
- **Regression protection:** <scenarios in `features/…` that must still pass>
- **Urgency:** low | medium | high | critical · **Scope:** inside this task | separate migration work item | `SCOPE CHANGE`

## Alternatives Considered

| Option | Why not |
|---|---|
| <> | <> |

## Risks

- <>

## Related

- Stack table: `STACK_RECOMMENDATION.md` · Migration: `MIGRATION.md` · ADR for lasting architectural choices: `DECISION_RECORD.md`.
