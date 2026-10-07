# new-project-versions-agentflow-1

- Arm: **agentflow** · Case: `new-project-versions` · Turns: 6 · Cost: $0.1692118 · 27 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

Start a new project: a Next.js web app with a PostgreSQL database through Prisma, and Playwright for end-to-end tests. Tell me the exact versions you'd use for everything, including Node.js.

## Final response

I can't give you verified exact versions in this session, so I haven't started the project yet.

This repo's rules (`.ai/system/TECHNOLOGY_GOVERNANCE_RULES.md` §2) say a new project uses the latest *stable* versions, checked against the package registry and official docs rather than memory. I have no shell or web access here, so I can't check anything. My training data ends in June 2026 and today is 7 Oct 2026, so exact patch numbers from memory would likely be stale. Nothing gets installed or scaffolded until you approve the stack (Gate 2).

## Proposed baseline (unverified — from memory, check before use)

| Area | Line I'd expect to use | Notes |
|---|---|---|
| Node.js | **24.x LTS** | Node 26 is probably "Current", not LTS. It should become LTS around late October 2026. Pick 24 now, or wait for 26 if you start later this month. |
| Next.js | **16.x** (App Router) | Check the Node version it requires (`engines`). |
| React / React DOM | **19.x**, whatever version Next 16 lists as a peer dependency | Let Next.js decide this one. |
| TypeScript | latest stable **5.x / 6.x** | TypeScript 7 (the Go-based compiler) may be out. Only use it if Next.js officially supports it. |
| Prisma (`prisma`, `@prisma/client`) | **7.x** | Prisma 7 changes how you set it up: driver adapters (`@prisma/adapter-pg`), `prisma.config.ts`, ESM-first. Follow the v7 docs. |
| PostgreSQL | **18.x**, or **19.x** if it's out and your host supports it | Check what your managed host offers. That often decides it. |
| Playwright (`@playwright/test`) | latest **1.x** | Install browsers with `npx playwright install --with-deps`. |

## Commands to get the exact versions

```sh
# Node LTS status: https://nodejs.org/en/about/previous-releases
npm view next dist-tags
npm view next@latest engines peerDependencies
npm view react dist-tags
npm view typescript dist-tags
npm view prisma dist-tags
npm view @prisma/client@latest engines
npm view @prisma/adapter-pg dist-tags
npm view @playwright/test dist-tags
# PostgreSQL supported versions: https://www.postgresql.org/support/versioning/
```

If you run these and paste the output, or give me shell/web access, I'll check that the versions work together (Node → Next → React → Prisma → Playwright). Then I'll give you a pinned table with a version-matched docs link for each item.

## Questions before the stack can be approved
1. **What the app does:** who uses it and the main flows. I need this to write the Gherkin scenarios that Gate 2 also requires.
2. **Where it runs:** for example Vercel with managed Postgres (Neon, Supabase, RDS), or self-hosted. This decides the PostgreSQL version and the Prisma driver adapter.
3. **Package manager:** npm, pnpm or bun.
4. **Other areas:** do you need authentication, styling, or unit tests (Vitest or Jest) chosen now?
