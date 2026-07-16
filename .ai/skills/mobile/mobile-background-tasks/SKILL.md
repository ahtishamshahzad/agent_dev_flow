---
name: mobile-background-tasks
description: Use to plan background execution — background fetch, location, audio, or task runners — within OS constraints, with battery and lifecycle awareness. Requires native support (dev build or CLI).
---

# Mobile Background Tasks

## Purpose

Plan background work: background fetch/location/audio or scheduled tasks within iOS/Android limits, with battery and lifecycle awareness.

## When to Use

- When work must continue or run periodically outside the foreground.
- Not for foreground-only work; not on Expo Go for capabilities needing a dev build.

## Inputs

- The background requirement (fetch/location/audio/task) and cadence.
- Runtime + build model; OS constraints.

## Discovery Questions

- What must run in the background, and how often?
- Which OS background modes/permissions are required?
- How is battery and OS throttling handled?
- What happens on app kill/restart?

## Responsibilities

- Identify the **background mode** (fetch/location/audio/processing) and its OS constraints.
- Plan **scheduling/cadence** within limits.
- Handle **battery/throttling** and **lifecycle** (kill/restart).
- Coordinate related features (`mobile-location-maps`, `mobile-notifications`).

## Required Workflow

1. Confirm the background need + native support.
2. Select background mode + permissions.
3. Plan cadence within OS limits.
4. Handle battery/lifecycle/throttling.
5. Record the background plan.

## Decision Rules

- Work within OS background limits — don't assume unlimited execution.
- Minimize wake frequency for battery; batch work.
- Background modes require justification and correct entitlements (`ios-readiness`, `android-readiness`).
- Native support required — dev build or CLI.

## Rules

- Respect OS background execution limits.
- Battery-aware scheduling.
- Coordinate entitlements with readiness skills.

## Anti-Patterns

- Assuming background runs freely.
- Frequent wakeups draining battery.
- Missing entitlements/justification for background modes.
- Ignoring app-kill/restart behavior.

## Validation Checklist

- [ ] Background mode + constraints identified.
- [ ] Cadence planned within limits.
- [ ] Battery/throttling/lifecycle handled.
- [ ] Entitlements coordinated.
- [ ] Native support confirmed.

## Definition of Done

A recorded background plan: the background mode and its constraints, battery-aware scheduling, lifecycle handling, and coordinated entitlements — with native support confirmed.

## Related Skills

`mobile-location-maps`, `mobile-notifications`, `mobile-native-modules`, `ios-readiness`, `android-readiness`, `mobile-performance`

## Related Knowledge

`../../../knowledge/` (background requirements).

## Related References

`../../../references/mobile/native/` when populated.

## Context Loading Guidance

- **Requires:** background requirement + cadence, runtime/build, OS constraints.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-location-maps`, `mobile-notifications`, readiness skills.
- **Stop when:** the background plan is recorded.

## Token Efficiency Guidance

Plan the mode + cadence + constraints; delegate entitlements to readiness skills.
