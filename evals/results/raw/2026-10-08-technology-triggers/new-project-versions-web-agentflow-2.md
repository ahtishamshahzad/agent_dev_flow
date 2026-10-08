# new-project-versions-web-agentflow-2

- Arm: **agentflow** · Case: `new-project-versions-web` · Turns: 30 · Cost: $0.6451866 · 87 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

Start a new project: a Next.js web app with a PostgreSQL database through Prisma, and Playwright for end-to-end tests. Tell me the exact versions you'd use for everything, including Node.js.

## Final response

I checked every version below against the npm registry, the official Node.js release schedule, postgresql.org, and the Next.js 16.4.0 and Prisma v7 docs on 2026-10-08. Nothing is installed or written yet; your project rules require your approval before any setup.

## Versions I'd use

| Area | Package | Version | Why this one |
|---|---|---|---|
| Runtime | Node.js | **24.21.0** ("Krypton", LTS) | Current LTS line. Next.js needs ≥20.9.0; Prisma 7 accepts `^20.19 \|\| ^22.12 \|\| >=24.0`. |
| Framework | `next` | **16.4.0** | The npm `latest` tag. The canary, preview and beta tags are excluded. |
| UI | `react` / `react-dom` | **19.3.0** | Next 16.4.0 accepts `^19.0.0`. I only queried `react`; `react-dom` normally ships with the same number but I haven't confirmed it. |
| Language | `typescript` | **7.0.2** | Latest stable. The Next.js 16.4.0 docs explicitly support TypeScript 7 for build-time type checking. |
| Database | PostgreSQL | **18.6** | Newest supported major, maintained until November 2030. |
| ORM | `prisma` (dev) + `@prisma/client` | **7.10.0** | Latest stable (see the first point below). |
| DB driver | `@prisma/adapter-pg` | **7.10.0** | Matches the Prisma version; Prisma 7 uses driver adapters. |
| E2E tests | `@playwright/test` | **1.64.0** | Latest stable. Needs Node ≥20; Next 16.4 accepts `^1.51.1`. |

## Points that change the obvious choice

1. **Prisma's npm `latest` tag is a release candidate (8.0.0-rc.21).** Running `npm install prisma` today would install an RC. No stable 8.x exists; the highest stable release is 7.10.0. The versions should be pinned exactly so the RC can't slip in.
2. **TypeScript 7 has no JavaScript compiler API yet.** Next.js handles this by running the `tsc` CLI for type checking. But other tools may rely on that API, such as typed ESLint rules and the Next.js editor plugin. I haven't checked those, so the TS 7 choice is unverified for them. If they break, the fallback is the newest TypeScript 5.x/6.x, which I'd confirm first.
3. **Node.js timing:** Node 24 enters maintenance on 2026-10-20, and Node 26 becomes LTS on 2026-10-28. I'd start on 24.21.0, which is supported until April 2028. Moving to 26 after it reaches LTS could be a later decision; it isn't needed to start.
4. **Not verified:** Prisma's docs didn't state which PostgreSQL versions it supports, so Prisma 7 with PostgreSQL 18 is still unconfirmed. I'll check this before setup.

## What I need from you before setup

1. **What does the app do?** Who uses it and what are the main flows? I need this to write the Gherkin scenarios (plain-language test cases) that come before any code and that the Playwright tests will be built from.
2. **Do you approve this version list?** Or do you want changes, for example falling back from TypeScript 7.
3. **Any constraints?** Where it will be hosted, whether PostgreSQL runs locally (Docker or native) or as a managed service, and your package manager (npm, pnpm or yarn).

Once you answer and approve, I'll record the decisions in `.ai/projects/current/`, then plan the architecture, phases and tasks for your second approval before any setup or code.
