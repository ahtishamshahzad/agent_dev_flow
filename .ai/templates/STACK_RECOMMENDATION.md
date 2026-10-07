# Stack Recommendation — <project>

> Fill-in template. Recommend a stack **per area** with alternatives and justification. Pair databases with data layers correctly; never compare a database to an ORM (`../skills/stack-recommendation`, `../system/STACK_DECISION_RULES.md`). Requires user approval (Gate 2).

- **Date:** <YYYY-MM-DD> · **Status:** proposed | approved

## Recommendation by Area

| Area | Recommended | Alternatives considered | Justification | What would flip it |
|------|-------------|-------------------------|---------------|--------------------|
| Backend framework | <Express / NestJS> | <> | <> | <> |
| Database | <PostgreSQL / MySQL / MongoDB> | <> | <> | <> |
| Data layer | <Prisma / Drizzle / Mongoose / native> | <> | <> | <> |
| Web | <> | <> | <> | <> |
| Mobile | <Expo / RN CLI> | <> | <> | <> |
| Hosting / deploy | <> | <> | <> | <> |

## Version Baseline

Each recommended technology at its **latest stable** version (current LTS for runtimes), verified against the registry or official release page — not memory — with the official docs for that version and a compatibility check across the chain. Full form: `TECHNOLOGY_DECISION.md` (`../system/TECHNOLOGY_GOVERNANCE_RULES.md`). For an existing project, list the **installed** versions instead and keep them unless an upgrade trigger applies.

| Area | Version | Verified how · when | Official docs (this version) |
|------|---------|---------------------|------------------------------|
| <> | <> | <> | <> |

## Pairing Check

- [ ] Database and data layer are a coherent pair (e.g. relational DB → Prisma/Drizzle; MongoDB → Mongoose/native).
- [ ] No database-vs-ORM comparison made.
- [ ] Versions are stable releases, verified (or labelled "unverified"), and compatible with each other.

## Trade-offs / Risks

- <Lock-in, ops cost, team familiarity, scaling notes>

## Related

- From: `APPLICATION_SELECTION.md`. Next: `ARCHITECTURE.md`. Gate 2 (user approval).
