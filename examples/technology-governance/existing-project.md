# Existing project — a newer version exists, and that's fine

> **Status: PROPOSED.** Fictional.

## The request

> Add a "favourite locations" screen to the delivery app.

## Audit — the technology baseline (from lock files, not ranges)

| Technology | Installed | Latest stable | Support status |
|---|---|---|---|
| Expo SDK | `X` | `X+2` | `X` still supported per Expo's SDK support policy |
| React Native | as pinned by Expo SDK `X` | newer | follows the SDK |
| Redux Toolkit | `2.N` | `2.M` | maintained |
| TypeScript | `5.N` | `5.M` | — |

`npm audit` (run, quoted in the audit): no advisories affecting the app.

## Decision

```
Upgrade available:    yes — Expo SDK X → X+2
Upgrade recommended:  no
Reason:               SDK X is supported, has no relevant advisories, and its documented
                      APIs (local storage, navigation, maps) cover the new screen.
```

- The screen is built with the **existing** stack: Expo SDK `X` APIs, existing navigation, the existing Redux Toolkit store — using **SDK `X`'s documentation**, not the latest docs.
- No new state manager, no ejecting from Expo, no "while we're here" upgrade.
- The drift is recorded for the team; a note is added to revisit when SDK `X` approaches the end of its support window (the next real trigger), with an app-store deadline check.

## What would have changed the answer

If SDK `X` were out of support, if a store policy required a newer SDK by a date, or if the screen needed an API only `X+2` provides — then an upgrade decision with its trigger, a migration plan, and regression scenarios (see `upgrade-required.md`).
