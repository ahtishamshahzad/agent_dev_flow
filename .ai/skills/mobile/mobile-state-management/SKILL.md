---
name: mobile-state-management
description: Use to decide where each piece of state lives — local component state, form state, shared client state, server state, persisted state, or navigation state. Prevents dumping everything into Redux/Zustand. Chooses the lightest tool that fits each category.
---

# Mobile State Management

## Purpose

Assign each piece of state to the right owner and tool, so the app uses the lightest approach that fits — not one global store for everything. Coordinates with `mobile-server-state` (server data) and `mobile-forms` (form state).

## When to Use

- When planning a screen/feature's data and interaction model.
- When an app over-uses (or lacks) a shared store.
- **Not** as a mandate to add a global store to every app.

## Inputs

- The feature's data: what's ephemeral, shared, fetched, persisted, or navigation-driven.
- Approved stack (which state tools are available).

## Discovery Questions

- Is this value used by one component, a subtree, or app-wide?
- Does it come from the server (then it's server state)?
- Must it survive app restarts (persisted)?
- Is it really navigation state (route params, focused tab)?

## Responsibilities

Classify each value into the right category and choose accordingly:
- **Local component state** — `useState`/`useReducer` for values one component owns.
- **Form state** — a form library (`mobile-forms`), not global state.
- **Shared client state** — Context for low-frequency shared UI state; Redux Toolkit or Zustand for genuinely app-wide, frequently-updated client state.
- **Server state** — a server-cache library (`mobile-server-state`: RTK Query / TanStack Query), **not** a manual global store.
- **Persisted state** — secure/async storage with a clear rehydration path (`mobile-secure-storage` for sensitive data).
- **Navigation state** — owned by the navigator (`mobile-navigation`), via params/route, not duplicated into a store.

## Required Workflow

1. List the feature's state values.
2. Classify each into one of the six categories.
3. Pick the lightest tool per category.
4. Keep server state out of client stores; keep form state in the form.
5. Record the state-ownership decisions.

## Decision Rules

- **Do not put every value in Redux/Zustand.** Reach for a global store only for genuinely app-wide, frequently-changing client state.
- Server data → server-cache library, not a hand-rolled global store.
- Form state → form library; navigation state → navigator; persisted → storage.
- Prefer Context over a store for simple, low-frequency shared UI state; prefer a store when Context would cause broad re-renders.

## Rules

- One category per value; don't duplicate the same state across owners.
- Keep client and server state separate.
- Choose from the approved stack; justify any store addition.

## Anti-Patterns

- "Everything in Redux/Zustand."
- Storing server data manually instead of using a cache library.
- Putting form state or route params into a global store.
- Context for high-frequency state (re-render storms).

## Validation Checklist

- [ ] Each value classified into one of the six categories.
- [ ] Lightest fitting tool chosen per category.
- [ ] Server state handled by a cache library, not a store.
- [ ] Form/navigation/persisted state owned correctly.
- [ ] Any global-store use justified.

## Definition of Done

A recorded state-ownership map: each value assigned to local / form / shared-client / server / persisted / navigation with the chosen tool — no over-centralization, client and server state separated.

## Related Skills

`mobile-server-state`, `mobile-forms`, `mobile-navigation`, `mobile-secure-storage`, `mobile-performance`, `../../stack-recommendation`.

## Related Knowledge

`../../../knowledge/` (data model, state decisions).

## Related References

`../../../references/mobile/state/` when populated.

## Context Loading Guidance

- **Requires:** the feature's state values, approved state tools.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-server-state`, `mobile-forms` for their categories.
- **Stop when:** the state-ownership map is recorded.

## Token Efficiency Guidance

Reason from the value list, not the whole screen tree. Delegate server/form state to their skills instead of restating them.
