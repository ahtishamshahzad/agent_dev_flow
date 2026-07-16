---
name: web-server-state
description: Use to plan the server-data layer — TanStack Query / RTK Query / SWR selection, query keys, caching, invalidation, retries, optimistic updates, and pagination; on Next.js, how server components and fetch caching split read paths from client queries. Server data lives here, not in a global store.
---

# Web Server State

## Purpose

Plan how the app fetches, caches, invalidates, and mutates server data. Selects the query layer with justification and defines its conventions (keys, staleness, retries, optimistic updates). On Next.js, also draws the line between server-component data fetching and client-side queries.

## When to Use

- After `web-state-management` assigns server data to this layer.
- When an existing app hand-rolls fetching in effects or stores API data in Redux.
- **Not** for transport mechanics (`web-api-integration`) or form submission UX (`web-forms`).

## Inputs

- The state map (`web-state-management`) and API surface (`web-api-integration`).
- Framework foundation — server components change the read path on Next.js.
- Freshness/consistency requirements per data type (dashboards often need tighter invalidation).

## Discovery Questions

- Which data is read-mostly (long staleness) vs live (polling/short staleness/websocket)?
- (Next.js) Which reads belong in server components with fetch caching/revalidation vs interactive client queries?
- Where do mutations need optimistic updates vs invalidate-and-refetch?
- Which lists need pagination/infinite scroll, and how large can they get (`dashboard-tables`)?

## Responsibilities

- **Select the query library** (TanStack Query, RTK Query, SWR) with justification — RTK Query only pairs naturally where Redux is already justified.
- Define **query-key conventions** mirroring the API's resource structure.
- Set **caching/staleness defaults** per data class; define **invalidation** rules per mutation.
- Plan **error/retry** policy (bounded retries, no retry on 4xx) and loading UX expectations.
- Plan **optimistic updates** only where UX payoff justifies rollback complexity.
- (Next.js) Assign each read path: server component fetch (with revalidation tags) vs client query — not both for the same view without a reason.

## Required Workflow

1. Take the server-data inventory from the state map.
2. Classify data by freshness/consistency needs.
3. Choose the library (and the server/client read split on Next.js) with justification.
4. Define keys, staleness, invalidation-per-mutation, retry policy.
5. Record conventions; hand transport details to `web-api-integration`.

## Decision Rules

- Every mutation lists the queries it invalidates — unlisted invalidation is a bug waiting.
- Default staleness > 0 for read-mostly data; "always refetch everything" is not a strategy.
- Optimistic updates require a defined rollback path; otherwise invalidate-and-refetch.
- Don't duplicate a server-component-fetched view as a client query; pick the owner per view.
- Polling/websockets only for data whose staleness genuinely hurts users.

## Rules

- Server data never mirrors into a global client store (`web-state-management`).
- Query functions throw typed errors mapped by `web-api-integration`; the layer surfaces them to `web-error-handling`.
- Conventions are written once and followed; per-feature ad-hoc caching is a review flag.

## Anti-Patterns

- `useEffect` + `fetch` + local state re-implementing a query cache badly.
- Copying query results into Redux/Zustand "for access elsewhere."
- Infinite retry loops hammering a failing endpoint.
- Optimistic updates with no rollback, leaving phantom UI state on failure.

## Validation Checklist

- [ ] Library selected with justification (and server/client read split on Next.js).
- [ ] Query-key conventions defined.
- [ ] Staleness defaults per data class recorded.
- [ ] Invalidation rules mapped per mutation.
- [ ] Retry/error policy defined; optimistic updates limited to justified cases.

## Definition of Done

A recorded server-state plan — library choice, key conventions, caching/invalidation/retry rules, and (on Next.js) the server/client read split — that features can implement uniformly without inventing per-screen data logic.

## Related Skills

`web-state-management`, `web-api-integration`, `web-forms`, `web-error-handling`, `dashboard-tables`, `dashboard-reporting`, `nextjs-foundation`.

## Related Knowledge

`../../../knowledge/` (API resource model, freshness requirements).

## Related References

`../../../references/web/state/` (query conventions — when populated).

## Context Loading Guidance

- **Requires:** state map, API surface summary, freshness needs.
- **Does not require:** full backend source, UI component detail.
- **May load:** `web-api-integration` for transport; `dashboard-tables` for heavy-list needs.
- **Stop when:** the server-state conventions are recorded.

## Token Efficiency Guidance

Define conventions once (keys, staleness classes, invalidation table) rather than per-endpoint prose. A mutation→invalidates table beats paragraphs.
