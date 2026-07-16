---
name: mobile-server-state
description: Use to plan server-state caching for mobile — RTK Query or TanStack Query — for fetching, caching, invalidation, retries, and offline behavior. Keeps server data out of client stores.
---

# Mobile Server State

## Purpose

Plan how the app fetches and caches server data: choose RTK Query or TanStack Query and define queries, mutations, caching/invalidation, retries, and offline/refetch behavior.

## When to Use

- When the app reads/writes server data (most apps).
- When server data is being stored manually in Redux/Zustand.
- Not for purely local/client state (`mobile-state-management`).

## Inputs

- The API surface (`mobile-api-integration`) and data needs.
- Approved stack (RTK Query vs TanStack Query).

## Discovery Questions

- RTK Query (if using Redux Toolkit) or TanStack Query?
- What are the cache keys, invalidation triggers, and staleness needs?
- What retry/backoff and offline behavior are required?
- Any optimistic updates needed?

## Responsibilities

- Choose **RTK Query** or **TanStack Query** aligned to the stack.
- Define **queries/mutations**, **cache keys**, and **invalidation**.
- Plan **retries/backoff**, **stale-while-revalidate**, and **offline** behavior.
- Keep **server state separate** from client state; support optimistic updates where useful.

## Required Workflow

1. Map the API surface to queries/mutations.
2. Choose the cache library.
3. Define keys, invalidation, staleness.
4. Plan retries/offline/optimistic behavior.
5. Record the server-state plan.

## Decision Rules

- RTK Query pairs naturally with Redux Toolkit; TanStack Query is store-agnostic — choose by stack fit.
- Server data belongs in the cache library, never hand-rolled in a client store.
- Invalidate by cache key on mutation; avoid manual refetch spaghetti.

## Rules

- Separate server and client state.
- Align with the approved data-fetching tool.
- Coordinate the transport with `mobile-api-integration`.

## Anti-Patterns

- Storing server data manually in Redux/Zustand.
- No invalidation strategy (stale data).
- Ignoring offline/retry for a mobile network.
- Refetching everything on every change.

## Validation Checklist

- [ ] Cache library chosen + stack-aligned.
- [ ] Queries/mutations + keys defined.
- [ ] Invalidation strategy defined.
- [ ] Retry/offline/optimistic behavior planned.
- [ ] Server state kept out of client stores.

## Definition of Done

A recorded server-state plan: chosen cache library, queries/mutations with keys and invalidation, retry/offline/optimistic behavior — with server data kept out of client stores.

## Related Skills

`mobile-api-integration`, `mobile-state-management`, `mobile-error-handling`, `mobile-environment-config`, `../../stack-recommendation`

## Related Knowledge

`../../../knowledge/` (API contracts, data model).

## Related References

`../../../references/mobile/state/` when populated.

## Context Loading Guidance

- **Requires:** API surface, data needs, approved fetching tool.
- **Does not require:** the whole app source, unrelated references, every mobile skill.
- **May load:** `mobile-api-integration` for the transport.
- **Stop when:** the server-state plan is recorded.

## Token Efficiency Guidance

Work from the API surface summary; delegate transport to api-integration and client state to state-management.
