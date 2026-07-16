---
name: mobile-location-maps
description: Use to plan location and maps — foreground/background location permissions, a maps provider, markers/regions, and battery-aware location usage. Requires native support (dev build or CLI).
---

# Mobile Location Maps

## Purpose

Plan location and maps: request the right location permissions, choose a maps provider, render markers/regions, and use location in a battery-aware way.

## When to Use

- When the app uses the device location or shows maps.
- Not on Expo Go for capabilities needing a dev build.

## Inputs

- Location/maps requirements (foreground vs background, precision).
- Maps provider; runtime + build model.

## Discovery Questions

- Foreground-only or background location? What precision?
- Which maps provider/SDK?
- What markers/regions/interactions are needed?
- How is battery/precision balanced?

## Responsibilities

- Handle **foreground/background location permissions** and denial.
- Choose a **maps provider** and render **markers/regions**.
- Use location **battery-aware** (accuracy/interval) (`mobile-performance`, `mobile-background-tasks`).
- Handle permission and accuracy edge cases.

## Required Workflow

1. Confirm needs + native support.
2. Request appropriate permissions; handle denial.
3. Set up maps + markers/regions.
4. Tune accuracy/interval for battery.
5. Record the location/maps plan.

## Decision Rules

- Request only the location scope needed (foreground vs background).
- Background location has strict OS review requirements — justify and plan it explicitly.
- Tune accuracy/interval to protect battery.
- Native support required — dev build or CLI, not Expo Go.

## Rules

- Respect permission models; justify background use.
- Battery-aware location usage.
- Coordinate background with `mobile-background-tasks`.

## Anti-Patterns

- Requesting background location without need/justification.
- High-accuracy polling draining battery.
- Assuming Expo Go covers maps/background location.
- Ignoring denied/limited-precision states.

## Validation Checklist

- [ ] Native support confirmed.
- [ ] Correct permission scope + denial handling.
- [ ] Maps provider + markers/regions planned.
- [ ] Battery-aware accuracy/interval.
- [ ] Background use justified if used.

## Definition of Done

A recorded location/maps plan: correct permission scope, a maps provider with markers/regions, battery-aware usage, and justified background location — with native support confirmed.

## Related Skills

`mobile-background-tasks`, `mobile-native-modules`, `mobile-performance`, `mobile-builds`

## Related Knowledge

`../../../knowledge/` (location requirements).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** location/maps requirements, provider, runtime/build model.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-background-tasks`, `mobile-performance`.
- **Stop when:** the location/maps plan is recorded.

## Token Efficiency Guidance

Plan permissions + provider + battery tuning; keep it focused.
