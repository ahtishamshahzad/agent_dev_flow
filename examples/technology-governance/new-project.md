# New project — choosing versions

> **Status: PROPOSED.** Fictional. Versions are placeholders; the point is how they are found.

## Requirement

A booking web app with an API and PostgreSQL. Applications and stack families are already selected (`stack-recommendation`): Next.js for the web app, NestJS for the API, PostgreSQL + Prisma, Playwright for end-to-end tests.

## Research — verified, not remembered

| Area | Check | Result recorded |
|---|---|---|
| Runtime | Node.js release schedule (official) | current **Active LTS** line `<NN>` — not the newer *Current* line, which is not yet LTS |
| Web | `npm view next dist-tags` · Next.js release notes | `latest` = `<X.Y.Z>`; a `canary` tag exists → **ignored** (pre-release) |
| API | `npm view @nestjs/core dist-tags` | `<X.Y.Z>` stable |
| Data layer | `npm view prisma dist-tags` · Prisma system requirements page | `<X.Y.Z>`; supported Node and PostgreSQL versions noted |
| Database | PostgreSQL versioning policy (official) | newest major still within its support window: `<NN>` |
| E2E | `npm view @playwright/test dist-tags` | `<X.Y.Z>` |

The agent states the date of each check. Had it no registry or web access, every row would read "unverified — from memory, check before use".

## Compatibility — checked as a chain

```
Node <NN> LTS ──→ satisfies next@<X> engines (">= …")        ✓
              ──→ satisfies @nestjs/core@<X> engines          ✓
              ──→ in Prisma's supported Node list             ✓
Prisma <X>    ──→ supports PostgreSQL <NN>                    ✓
next@<X>      ──→ peer react@<X> / react-dom@<X>              → pin both to the peer range
```

One conflict found: a UI library candidate listed `react` peer support one major behind. Resolution: choose its newer major that supports the selected React, or an alternative — not downgrading React.

## Documentation

Each decision links the official docs **for the selected major** (the framework's versioned docs, not a blog post or the docs of a later canary). Implementation follows that version's recommended routing, data-fetching, and build patterns.

## Decision → Gate 2

Recorded in `TECHNOLOGY_DECISION.md` (baseline form) and presented with the stack table for approval. Nothing is installed before Gate 2.
