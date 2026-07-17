---
name: web-state-management
description: Use to decide where each piece of web app state lives — local component, form, shared client, server cache, URL, or persisted — before picking any state library. URL state is first-class on the web; server data belongs to the server-state layer, not a global store.
---

# Web State Management

## Purpose

Classify every significant piece of state into the layer that owns it — local, form, shared client, server cache, **URL**, or persisted — and only then decide whether a shared-state library is needed at all. Prevents the everything-in-Redux failure mode.

## When to Use

- After the foundation skill, before data-heavy feature work.
- When an existing app shows state sprawl (server data in a global store, filters lost on refresh).
- **Not** for server-data mechanics (`web-server-state`) or form internals (`web-forms`).

## Inputs

- Feature/page inventory and what each screen displays or edits.
- Framework foundation (server components shift some state server-side).
- Auth/session state expectations (`web-authentication`).

## Discovery Questions

- For each piece of state: who reads it, who writes it, does it survive refresh, is it shareable via link?
- What is genuinely **shared client state** (theme, session presence, layout prefs) vs data one page fetches?
- Which list views need URL-carried filters/pagination/sort?
- Is anything left that actually requires a store library — and how much?

## Responsibilities

- Classify state into: **local** (component), **form** (`web-forms`), **shared client**, **server cache** (`web-server-state`), **URL** (`web-routing`), **persisted** (localStorage/cookies — mind security for anything auth-adjacent, `web-authentication`).
- Route each category to its owning mechanism; keep categories from leaking into each other.
- If shared client state remains, **evaluate** the mechanism (Context for low-churn, Zustand/Redux Toolkit for richer needs) with justification.
- Define persistence rules: what survives refresh, what must not (secrets, volatile UI state).

## Required Workflow

1. Inventory state per feature/page.
2. Classify each item into exactly one category.
3. Confirm server data goes to the server-state layer and shareable view state to the URL.
4. Size the residual shared-client-state need; select a mechanism only if justified.
5. Record the map; hand category detail to the owning skills.

## Decision Rules

- **Server data is never "app state"** — it's a cache owned by `web-server-state`.
- Anything a user would bookmark, share, or expect back/forward to respect → URL.
- Start local; lift state only when a second consumer actually exists.
- Context is fine for rarely-changing values; high-frequency updates through Context are a re-render trap.
- No store library enters the project without a category of state that demonstrably needs it.

## Rules

- One owner per state item; duplicating the same fact in two layers requires a sync story or a redesign.
- Persisted state gets versioning/migration thought before shipping.
- No tokens/secrets in localStorage by default (`web-authentication` owns that decision).

## Anti-Patterns

- Mirroring API responses into Redux/Zustand "so it's available."
- Filters and pagination in memory only — lost on refresh, unshareable.
- Global store as the first resort for what one component owns.
- Two sources of truth for the same value (URL + store) drifting apart.

## Validation Checklist

- [ ] State inventory classified into the six categories.
- [ ] Server data assigned to the server-state layer, not a client store.
- [ ] URL-state decisions recorded per list/filter view.
- [ ] Shared-client mechanism chosen only for demonstrated need, with justification.
- [ ] Persistence + security rules noted for persisted items.

## Definition of Done

A recorded state map assigning every significant value to exactly one owning layer, with the shared-client mechanism (if any) justified — ready for `web-server-state`, `web-forms`, and `web-routing` to implement their parts.

## Related Skills

`web-server-state`, `web-forms`, `web-routing`, `web-authentication`, `vite-react-foundation`, `nextjs-foundation`, `../../stack-recommendation`.

## Related Knowledge

`../../../knowledge/` (domain model, session model).

## Related References

`../../../references/web/state/` (when populated).

## Context Loading Guidance

- **Requires:** feature/page inventory, framework foundation.
- **Does not require:** API schemas in full, component internals.
- **May load:** `web-server-state` next; `web-forms` for form-heavy flows.
- **Stop when:** the state map and mechanism decision are recorded.

## Token Efficiency Guidance

Work from the state inventory table, not screen-by-screen prose. One line per state item: name → category → owner.
