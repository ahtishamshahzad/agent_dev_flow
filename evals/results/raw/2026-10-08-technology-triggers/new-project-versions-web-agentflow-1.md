# new-project-versions-web-agentflow-1

- Arm: **agentflow** · Case: `new-project-versions-web` · Turns: 36 · Cost: $0.7478100000000001 · 120 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

Start a new project: a Next.js web app with a PostgreSQL database through Prisma, and Playwright for end-to-end tests. Tell me the exact versions you'd use for everything, including Node.js.

## Final response

I've checked every version against the npm registry and the official docs. Now I'm writing up the recommendation.

# Proposed version baseline (not yet approved, nothing installed)

I followed this repo's `.ai/` rules: classified as a **new project** (empty repo, no code), so the rule is "latest **stable**, checked against registries and official docs, not memory." No files were created and no dependencies were installed. Under `.ai/system/QUALITY_GATES.md`, that waits until you approve (Gate 2).

| Area | Package | Exact version | How it was checked |
|---|---|---|---|
| Runtime | **Node.js** | **24.21.0** (LTS "Krypton") | nodejs.org/dist index + official release schedule |
| Framework | `next` | **16.4.0** | `npm view next dist-tags` → `latest` |
| UI | `react` / `react-dom` | **19.3.0** | npm `latest`; fits Next's `^19.0.0` peer range |
| Language | `typescript` | **6.0.3** (not 7.0.2, see below) | npm; peer range check |
| Database | **PostgreSQL** | **18.6** | postgresql.org versioning page (supported until Nov 2030) |
| ORM | `prisma`, `@prisma/client` | **7.10.0** | npm (`latest` points to an RC, see below) |
| Postgres adapter | `@prisma/adapter-pg` | **7.10.0** | npm; Prisma 7 requires a driver adapter |
| E2E tests | `@playwright/test` | **1.64.0** | npm `latest`; Next requires `^1.51.1`, Playwright requires Node ≥20 |
| Lint | `eslint` / `eslint-config-next` | **10.12.0** / **16.4.0** | npm; peer ranges allow ESLint 9 and 10 |
| Types | `@types/node` / `@types/react` | **24.19.1** / **19.3.0** | npm; matched to Node 24 and React 19.3 |

The versions work together: Next 16.4.0 needs Node ≥20.9.0, Prisma 7.10.0 needs Node `^20.19 \|\| ^22.12 \|\| >=24.0`, and Prisma 7's docs list PostgreSQL 9.6–18 as supported.

## Choices that differ from "just take `latest`"

1. **Prisma 7.10.0, not 8.** npm's `latest` tag for Prisma currently points to **8.0.0-rc.21**, a release candidate. The rules exclude RCs, so I picked the newest stable release, 7.10.0. Prisma's main docs site now defaults to v8, so we'd need to use the v7 docs.
2. **TypeScript 6.0.3, not 7.0.2.** Next 16.4 supports TS 7 for type checking during `next build`. But `eslint-config-next@16.4.0` depends on `typescript-eslint`, which requires TypeScript `>=4.8.4 <6.1.0`, so linting would break on TS 7. TS 6.0.3 satisfies both. We can move to TS 7 once typescript-eslint supports it.
3. **Node 24 rather than 26.** Node 24 is the current Active LTS. Node 26 becomes LTS on **2026-10-28**, 20 days from now, and Prisma only tests LTS releases. Node 24 is supported until April 2028. Switching to 26 after the 28th would be a reasonable later change.
4. **Next 16.4.0 came out 2 days ago** (2026-10-06). It's a stable release. If you'd rather use something that has been out longer, 16.3.8 is the fallback.

## What I need before Gate 2

The rules require the planned behavior to be written as Gherkin scenarios and approved together with the stack. So I need:

1. **What the app does:** its main users and the 2–4 main things they do. I'll turn that into scenarios, which also become the Playwright tests.
2. **Approval or changes** for the table above, especially the TypeScript 6 and Node 24 choices.
3. **Optional extras** (not included above): styling (e.g. Tailwind), authentication, a unit-test runner (Vitest), and whether you need an admin dashboard. The rules treat a dashboard as a separate decision from the public site.

Once you answer, I'll write the scenarios and save the approved stack in `.ai/projects/current/`.

Sources:
- [Node.js release schedule](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json) · [Node.js dist index](https://nodejs.org/dist/index.json)
- [PostgreSQL versioning policy](https://www.postgresql.org/support/versioning/)
- [Next.js docs: TypeScript (v16.4.0)](https://nextjs.org/docs/app/api-reference/config/typescript) · [next.config.js: useTypeScriptCli](https://nextjs.org/docs/app/api-reference/config/next-config-js/useTypeScriptCli) · [Next.js PR #95831: TypeScript 7 fixes](https://github.com/vercel/next.js/pull/95831) · [Next.js discussion #95633](https://github.com/vercel/next.js/discussions/95633)
- [Prisma v7 system requirements](https://www.prisma.io/docs/orm/v7/reference/system-requirements) · [Prisma v7 supported databases](https://www.prisma.io/docs/orm/v7/reference/supported-databases) · [Upgrade to Prisma 7](https://www.prisma.io/docs/v6/orm/more/upgrades/to-v7)
- npm registry (`npm view` for each package above)
