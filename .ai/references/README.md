# `.ai/references/` — External-Facing Reference Material (Index)

Reference material organized by **topic folder**. Agents read **only the relevant folder** for the active task (`../system/CONTEXT_MANAGEMENT_RULES.md`, `../system/TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Folders start empty and are populated as a project develops. **Do not create fake reference content.**

## Topic tree

```
references/
├── product/                  # briefs, research, personas, journeys
├── designs/                  # mockups, wireframes, design-system exports
├── mobile/                   # (index) screens · navigation · forms · state · native · notifications
├── web/                      # (index) pages · dashboard · design-system · routing · state · forms · seo · testing
├── backend/                  # (index) auth · authorization · api · database · errors · abuse · jobs ·
│                             #         integrations · realtime · files · observability · performance ·
│                             #         security · testing · deployment · express · nestjs
├── database/                 # (index) schema · migrations · seeds · performance · transactions ·
│                             #         security · operations · prisma · drizzle · mongoose
├── testing/                  # (index) playwright · maestro · api
├── devops/                   # repo/monorepo strategy, Docker, envs, CI/CD, rollback, incidents
├── security/                 # threat models, authorization matrix, PII inventory, advisories
└── deployment/               # targets, CI/CD & Docker patterns, runbooks, readiness (no secrets)
```

## Index

| Topic | Index / folder | Read when |
|-------|----------------|-----------|
| Product | [`product/`](product/README.md) | Analyzing requirements / shaping features. |
| Designs | [`designs/`](designs/README.md) | Building UI to a design. |
| Mobile | [`mobile/README.md`](mobile/README.md) | Building the mobile app (screens/nav/forms/state/native/notifications). |
| Web | [`web/README.md`](web/README.md) | Building web/dashboard (pages/dashboard/forms/seo). |
| Backend | [`backend/README.md`](backend/README.md) | Building the API/service layer (auth/authorization/api/jobs/integrations/…). |
| Database | [`database/README.md`](database/README.md) | Designing schema, migrations, indexes, transactions, backups. |
| Testing | [`testing/README.md`](testing/README.md) | Writing tests (playwright/maestro/api). |
| DevOps | [`devops/`](devops/README.md) | Repo strategy, containers, environments, CI/CD, rollback, incidents. |
| Security | [`security/`](security/README.md) | Threat modelling, authorization matrix, privacy/PII, advisories. |
| Deployment | [`deployment/`](deployment/README.md) | Setting up/running deploy & ops (no secrets). |

## Overlaps — one home per topic

`devops/` and `deployment/` both touch shipping: keep **pipeline/environment/repo strategy** in `devops/`, and **target-specific setup and cross-cutting ops runbooks** in `deployment/`. Service-level release ordering lives in `backend/deployment/`. Likewise, `security/` holds the system-wide threat model and authorization matrix, while `backend/security/` and `database/security/` hold the layer-specific configuration. Cross-link; never duplicate.

Every **terminal** folder has a README stating: what belongs there, supported file types, naming conventions, how agents should use it, and that **references do not automatically become requirements**.
