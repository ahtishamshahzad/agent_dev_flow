# `.ai/skills/web/` — Web & Dashboard Skill Pack (Index)

Reusable, tool-neutral skills for planning and building web applications and admin dashboards (React on Next.js or Vite). Discover them **through this index**, then load only the relevant ones (`../../system/SKILL_SELECTION_RULES.md`). **Do not load the whole pack** — most tasks need 1–3 skills.

## Web applications are separate decisions

The system decides **separately** whether the project needs each of these (`../../system/APPLICATION_SELECTION_RULES.md`, `../application-selection`):

- a **public web** presence
- a **marketing website**
- a **customer web app**
- an **admin dashboard**

None is assumed. Each selected app gets its **own** framework decision (`web-stack-selection`), and the dashboard's placement is its own decision (`dashboard-architecture`) — in-app, route group, separate application, or separate repository.

Web skills evaluate options rather than blindly installing, keep server/client state separate, treat client-side checks as UX (the server enforces), plan rather than scaffold, and defer deploys/publishing to explicit approval. They coordinate with the core skills (`../`) — e.g. `web-performance` ↔ `../performance-review`, `web-deployment` ↔ `../release-planning`.

## Categories

### Stack & Foundation
| Skill | Description |
|-------|-------------|
| [`web-stack-selection`](web-stack-selection/SKILL.md) | Next.js vs Vite + React per app, on real SEO/rendering/backend needs; tendencies, **not absolute rules**. |
| [`nextjs-foundation`](nextjs-foundation/SKILL.md) | Next.js foundation: App Router, server/client split, per-route rendering strategy, baseline tooling. |
| [`vite-react-foundation`](vite-react-foundation/SKILL.md) | Vite + React SPA foundation: structure, client router, env exposure rules, SPA fallback. |
| [`existing-web-audit`](existing-web-audit/SKILL.md) | Audit an existing web app (framework, rendering, state, auth, tests, deploy) before changing it. |

### Routing & Design
| Skill | Description |
|-------|-------------|
| [`web-routing`](web-routing/SKILL.md) | Route tree, layouts, groups, dynamic segments, protected routes, URL-carried state. |
| [`web-design-system`](web-design-system/SKILL.md) | Tokens, scales, primitives, styling approach + component-library evaluation, cross-app UI sharing. |
| [`web-theme`](web-theme/SKILL.md) | Light/dark on tokens; system preference + persisted override; SSR flash avoidance. |

### State & Data
| Skill | Description |
|-------|-------------|
| [`web-state-management`](web-state-management/SKILL.md) | Where each value lives: local/form/shared/server/URL/persisted. URL state is first-class. |
| [`web-server-state`](web-server-state/SKILL.md) | TanStack Query / RTK Query / SWR; keys, caching, invalidation, retries; Next.js server/client read split. |
| [`web-api-integration`](web-api-integration/SKILL.md) | fetch vs Axios transport, env base URLs, auth attachment/refresh, typed error mapping, CORS/BFF. |

### Forms
| Skill | Description |
|-------|-------------|
| [`web-forms`](web-forms/SKILL.md) | React Hook Form + schema validation at the edges; accessible error/submit UX; server enforces. |

### Auth & Security
| Skill | Description |
|-------|-------------|
| [`web-authentication`](web-authentication/SKILL.md) | Session/token model, httpOnly cookies vs localStorage risk, CSRF, SSR auth, lifecycle; server enforces. |
| [`web-authorization`](web-authorization/SKILL.md) | Role/permission model, deny-by-default server enforcement, query-level scoping; UI hiding is UX. |

### Dashboard
| Skill | Description |
|-------|-------------|
| [`dashboard-architecture`](dashboard-architecture/SKILL.md) | Placement decision: in-app / route group / separate app / separate repo — weighed on roles, deployment, security, ownership, UI sharing, cadence. |
| [`dashboard-permissions`](dashboard-permissions/SKILL.md) | Admin roles by job, action permission matrix, audit logging, impersonation safeguards, least privilege. |
| [`dashboard-tables`](dashboard-tables/SKILL.md) | Server-side vs client-side pagination/sort/filter by size; shared table architecture; selection; virtualization. |
| [`dashboard-reporting`](dashboard-reporting/SKILL.md) | Pinned metric definitions, server-side aggregation, ranges/filters in URL, chart library evaluation, exports, heavy-query handling. |
| [`dashboard-bulk-operations`](dashboard-bulk-operations/SKILL.md) | Exact selection scope, confirmation, server-side batches, per-item permissions, partial failure, idempotency, undo, audit. |

### Quality & UX
| Skill | Description |
|-------|-------------|
| [`web-seo`](web-seo/SKILL.md) | Metadata, OG cards, sitemap/robots/canonicals, JSON-LD, indexable rendering — scoped to public surfaces only. |
| [`web-accessibility`](web-accessibility/SKILL.md) | Semantic HTML, keyboard + focus management, labeled forms, per-theme contrast, axe + manual passes. |
| [`web-performance`](web-performance/SKILL.md) | Measured Core Web Vitals budgets; splitting/images/fonts/caching; validate in production builds. |
| [`web-error-handling`](web-error-handling/SKILL.md) | Route-level boundaries, async error surfacing, 404/403/500 pages, PII-safe reporting, stale-client handling. |

### Testing
| Skill | Description |
|-------|-------------|
| [`web-unit-testing`](web-unit-testing/SKILL.md) | Vitest/Jest for logic, hooks, schemas; fast, deterministic, colocated. |
| [`web-component-testing`](web-component-testing/SKILL.md) | React Testing Library + user-event; role-first queries; MSW at the boundary; behavior over implementation. |
| [`playwright-e2e`](playwright-e2e/SKILL.md) | Playwright for **critical** journeys: auth/authorization, forms, dashboards, reports, checkout; isolated data/envs; CI with artifacts. |

### Delivery
| Skill | Description |
|-------|-------------|
| [`web-deployment`](web-deployment/SKILL.md) | Platform per framework needs, env/secret flow, previews, CDN/caching, domains, rollback; deploys need approval. |

## Selection guidance (web)

| Situation | Load (only these) |
|---|---|
| New web app | `web-stack-selection` → `nextjs-foundation`/`vite-react-foundation` → `web-routing` → `web-design-system` |
| Existing web app | `existing-web-audit` first, then the relevant feature skills |
| Admin dashboard requested | `dashboard-architecture` **first**, then placement consequences (`web-stack-selection` if separate app) → dashboard feature skills |
| Building pages/screens | `web-routing` + `web-design-system` (+ `web-theme` as needed) + `web-accessibility` |
| Data/state work | `web-state-management` → `web-server-state` + `web-api-integration` |
| Forms | `web-forms` (+ `web-accessibility` for error UX) |
| Auth | `web-authentication` + `web-authorization` |
| Dashboard features | `dashboard-tables` / `dashboard-reporting` / `dashboard-bulk-operations` + `dashboard-permissions` |
| Public/marketing content | `web-seo` + `web-performance` (+ `nextjs-foundation` rendering strategy) |
| Testing | `web-unit-testing` / `web-component-testing`; `playwright-e2e` **only for critical journeys** |
| Shipping | `web-deployment` (+ `../release-planning`, `../environment-audit`) |

## Dependency guidance (how web skills relate)

- **Applications are decided first** (`../application-selection`), the **dashboard's placement second** (`dashboard-architecture`), the **framework per app third** (`web-stack-selection`) → one foundation skill; everything else follows.
- **State** splits by category (`web-state-management`), delegating server data to `web-server-state` and transport to `web-api-integration`.
- **Forms** delegate submission transport to `web-api-integration`; **auth** (`web-authentication`) feeds **authorization** (`web-authorization`), which `dashboard-permissions` deepens for admin surfaces.
- **Dashboard features** (`dashboard-tables` → `dashboard-bulk-operations`, `dashboard-reporting`) sit on the state/permission layers.
- **Quality skills** thread through everything: `web-accessibility` into design/forms/testing; `web-performance` ↔ `../performance-review`; `web-seo` only where surfaces are public.
- **Testing** layers: unit → component → Playwright (critical journeys only).
- **Shipping** chains `web-deployment` → `../release-planning`, gated on the test layers.

## References

Web reference material (examples, patterns — not permanent skill content) lives under:
`../../references/web/routing/`, `.../design-system/`, `.../forms/`, `.../state/`, `.../dashboard/`, `.../seo/`, `.../testing/` — populated as the project develops.

## Rule: do NOT load the whole pack

Loading every web skill wastes context (`../../system/TOKEN_OPTIMIZATION_RULES.md`). Select the minimum relevant set via this index, load one stage at a time, and unload on task switch.
