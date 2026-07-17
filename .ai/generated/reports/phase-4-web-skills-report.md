# Phase 4 Report — Web & Dashboard Skill Pack

**Date:** 2026-07-16
**Scope:** `.ai/skills/web/` (26 skills + pack index), index updates, web reference topic folders.

## What was created

### `.ai/skills/web/` — 26 skills, each a `SKILL.md` in the Phase-2/3 standard format

(Purpose → When to Use → Inputs → Discovery Questions → Responsibilities → Required Workflow → Decision Rules → Rules → Anti-Patterns → Validation Checklist → Definition of Done → Related Skills/Knowledge/References → Context Loading Guidance → Token Efficiency Guidance.)

**Stack & Foundation:** `web-stack-selection`, `nextjs-foundation`, `vite-react-foundation`, `existing-web-audit`
**Routing & Design:** `web-routing`, `web-design-system`, `web-theme`
**State & Data:** `web-state-management`, `web-server-state`, `web-api-integration`
**Forms:** `web-forms`
**Auth & Security:** `web-authentication`, `web-authorization`
**Dashboard:** `dashboard-architecture`, `dashboard-permissions`, `dashboard-tables`, `dashboard-reporting`, `dashboard-bulk-operations`
**Quality & UX:** `web-seo`, `web-accessibility`, `web-performance`, `web-error-handling`
**Testing:** `web-unit-testing`, `web-component-testing`, `playwright-e2e`
**Delivery:** `web-deployment`

### Key design decisions encoded

- **Applications are separate decisions.** The pack index and `web-stack-selection`/`dashboard-architecture` require public web, marketing website, customer web app, and admin dashboard to each be decided independently via `application-selection` / `APPLICATION_SELECTION_RULES.md`. Nothing is assumed or auto-scaffolded.
- **Next.js vs Vite as tendencies, not rules.** Next.js normally when SEO/SSR-SSG/public content/server components/integrated server features matter; Vite normally for authenticated SPAs, internal dashboards, separate backends, no-SEO lightweight clients. `web-stack-selection` states explicitly these are not absolute, decides per app, and an embedded dashboard inherits its host app's framework.
- **Dashboard placement is its own gate-bound decision.** `dashboard-architecture` evaluates in-app vs route group vs separate application vs separate repository against six factors: user roles, deployment boundaries, security boundaries, team ownership, UI system sharing, release cadence.
- **Playwright covers the mandated surface.** Critical user journeys, authentication (storageState per role), authorization (per-role allowed + denied), forms, dashboards, reports, checkout (test rails only), visual regression **only when justified**, seeded/isolated test data, environment isolation (never prod), CI execution with artifacts/retry policy, and regression coverage for fixed high-impact bugs.
- **System invariants carried through:** server enforces auth/authz (client checks are UX), server/client state separation with URL state first-class, plan-don't-scaffold, no installs/deploys without approval, measured-not-speculative performance, honest verified-vs-unverified reporting.

### Index updates

- `.ai/skills/README.md` — added **Web & Dashboard (26 skills)** row to Domain skill packs, added **web project** selection-guidance row, extended the domain-pack coordination note (also restores the Phase-3 mobile rows, which were uncommitted in the main checkout).
- `.ai/skills/web/README.md` — new pack index: categories, selection guidance, dependency guidance, do-not-load-whole-pack rule.
- `.ai/references/README.md` — registered `mobile/` (previously unregistered) and `web/` topic folders.
- `.ai/references/web/` — topic folders created: `routing/`, `design-system/`, `forms/`, `state/`, `dashboard/`, `seo/`, `testing/` (with `.gitkeep`).

## Verification

- 26/26 `SKILL.md` files present; frontmatter `name` matches directory name for all.
- All required sections present in all 26 skills.
- All pack-index links resolve; no stray characters.
- No application code, no dependencies, no scaffolding added (system scope respected).

## Location / integration

Work was produced in the isolated worktree `.claude/worktrees/phase-4-web-skills` (branch `worktree-phase-4-web-skills`), uncommitted per `OPERATING_RULES.md` §9 (no commit/push without explicit approval). To bring into the main checkout:

```sh
cd /Users/apple/Desktop/skills/ai-engineering-system
cp -R .claude/worktrees/phase-4-web-skills/.ai/skills/web .ai/skills/web
cp -R .claude/worktrees/phase-4-web-skills/.ai/references/web .ai/references/web
cp .claude/worktrees/phase-4-web-skills/.ai/skills/README.md .ai/skills/README.md
cp .claude/worktrees/phase-4-web-skills/.ai/references/README.md .ai/references/README.md
cp .claude/worktrees/phase-4-web-skills/.ai/generated/reports/phase-4-web-skills-report.md .ai/generated/reports/
```

(The copied `skills/README.md` and `references/README.md` are supersets of the current main-checkout versions — mobile content preserved.)
