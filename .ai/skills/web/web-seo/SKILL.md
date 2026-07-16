---
name: web-seo
description: Use to plan SEO for web apps where search visibility matters — per-page metadata, Open Graph/Twitter cards, sitemap, robots, canonical URLs, structured data (JSON-LD), and rendering strategy for indexable content. Applies to public/marketing surfaces; skip for authenticated dashboards.
---

# Web SEO

## Purpose

Plan search visibility for the surfaces that need it: metadata and social cards per page, crawlability (sitemap, robots, canonicals), structured data, and a rendering strategy that serves real HTML to crawlers. SEO effort is scoped to the apps where it matters — a marketing site, yes; an internal dashboard, no.

## When to Use

- For public web / marketing / indexable content surfaces (per `../../application-selection` and `web-stack-selection`).
- When an existing public app underperforms in search or unfurls badly when shared.
- **Not** for authenticated SPAs or admin dashboards — record "SEO: not applicable" and move on.

## Inputs

- Which pages/routes are public and should rank; content/keyword intent per page.
- Rendering strategy from `nextjs-foundation` (SEO-relevant apps normally chose Next.js — content must be server-rendered or static).
- Domain/URL structure plans (`web-deployment`).

## Discovery Questions

- Which pages carry the search value (home, product/landing pages, blog, docs), and what should each rank for?
- What social-share behavior is expected (OG/Twitter cards per page type)?
- Which structured-data types fit (Organization, Product, Article, FAQ, Breadcrumb)?
- Are there duplicate-content risks needing canonicals (params, pagination, staging)? Multiple locales (hreflang)?

## Responsibilities

- Plan **per-page metadata**: unique title/description per indexable page, templated by page type; Open Graph/Twitter card fields with correctly sized images.
- Plan **crawlability**: XML sitemap generation (kept current), robots rules (block staging/preview and non-indexable areas, never block what should rank), canonical URLs for parameterized/duplicate views.
- Plan **structured data** (JSON-LD) per page type where it earns rich results — valid and truthful, not markup spam.
- Confirm the **rendering strategy** serves complete HTML for indexable content (static/ISR/SSR per `nextjs-foundation`) — client-only rendering for content that must rank is a finding to escalate to `web-stack-selection`.
- Align with **Core Web Vitals** (`web-performance`) and semantic heading structure (`web-accessibility`) — both feed ranking.
- Define URL conventions: stable, readable, lowercase paths; redirects for moved content.

## Required Workflow

1. Scope: list indexable pages; explicitly exempt non-SEO surfaces.
2. Define metadata + social-card templates per page type.
3. Plan sitemap/robots/canonical mechanics.
4. Select structured-data types per page and their data sources.
5. Verify rendering serves indexable HTML; record the plan and validation approach (Lighthouse SEO, rich-results test — run or mark "unverified until run").

## Decision Rules

- SEO scope follows the application decision — spend nothing on surfaces that will never be indexed.
- Content that must rank is rendered server-side/static; no exceptions built on "Google runs JS."
- One canonical URL per piece of content; parameters/variants point at it.
- Structured data only where the page genuinely is that thing.

## Rules

- Staging/preview environments are never indexable (robots + auth, both).
- Metadata is data-driven per page — no site-wide duplicate titles.
- No cloaking, keyword stuffing, or markup describing content that isn't on the page.

## Anti-Patterns

- Retrofitting SEO onto a client-only SPA that should have escalated the framework decision.
- Same title/description on every page.
- Sitemap listing 404s/redirects; robots.txt blocking the whole site in production (or staging left indexable).
- JSON-LD claiming reviews/ratings the page doesn't show.

## Validation Checklist

- [ ] Indexable pages scoped; non-SEO surfaces exempted explicitly.
- [ ] Per-page metadata + social cards planned by page type.
- [ ] Sitemap, robots, and canonical mechanics planned (staging blocked).
- [ ] Structured data planned per page type, truthfully.
- [ ] Rendering verified to serve indexable HTML (or escalated).
- [ ] Validation runs planned or executed (marked if unrun).

## Definition of Done

A recorded SEO plan scoped to the surfaces that need it — metadata templates, crawlability mechanics, structured data, and confirmed indexable rendering — with validation steps run or explicitly marked unverified.

## Related Skills

`web-stack-selection`, `nextjs-foundation`, `web-performance`, `web-accessibility`, `web-routing`, `web-deployment`.

## Related Knowledge

`../../../knowledge/` (content strategy, target queries).

## Related References

`../../../references/web/seo/` (metadata templates, schema examples — when populated).

## Context Loading Guidance

- **Requires:** indexable-page list, rendering strategy, URL/domain plans.
- **Does not require:** dashboard skills, state/data internals.
- **May load:** `web-performance` for Core Web Vitals; `web-deployment` for domain/redirect mechanics.
- **Stop when:** the SEO plan and validation status are recorded.

## Token Efficiency Guidance

Template metadata by page type instead of enumerating every page. Keep schema examples in references; the plan lists types and sources only.
