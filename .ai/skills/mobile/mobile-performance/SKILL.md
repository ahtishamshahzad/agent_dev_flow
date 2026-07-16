---
name: mobile-performance
description: Use to plan and diagnose mobile performance — list rendering, re-renders, image/memory usage, startup, and jank — measured on a representative build. Prefer measured, safe fixes over rewrites. The mobile arm of performance-review.
---

# Mobile Performance

## Purpose

Plan and diagnose mobile performance: locate the real bottleneck (lists, re-renders, images/memory, startup, jank) via measurement and plan safe, behavior-preserving fixes on a representative build.

## When to Use

- When a screen/list is janky, slow to start, or memory-heavy.
- Before a performance-motivated refactor.
- Not as blanket optimization without a measured bottleneck.

## Inputs

- The slow scenario (screen, action, platform, build).
- Profiling data or a plan to obtain it.

## Discovery Questions

- What is slow, under what action/scale, on which platform?
- Debug or release/production-like build?
- Is there a measurement, or must one be taken?
- Low-end device behavior?

## Responsibilities

- Locate the bottleneck: **list rendering** (FlatList config, keys, memoized rows), **re-renders**, **image/memory** pressure, **startup**, or **animation jank**.
- Plan **safe, targeted fixes** preserving behavior.
- **Validate** on a representative build; capture before/after.
- Escalate structural fixes to `../../refactor-planning`.

## Required Workflow

1. Reproduce + measure on a representative build.
2. Trace the bottleneck to specific code.
3. Plan minimal behavior-preserving fixes.
4. Re-measure; capture before/after.
5. Record findings + residual risks.

## Decision Rules

- No optimization without a measured bottleneck.
- Prefer small measurable wins over rewrites.
- Judge from release-like conditions, not debug.
- Don't add heavy libraries (e.g. list libs) without measured justification.

## Rules

- Preserve behavior; performance work is not a feature change.
- Measure before/after; quote numbers.
- Flag unrun measurements 'unverified until run'.

## Anti-Patterns

- Premature memoization / blind micro-optimization.
- Judging performance from a debug build.
- Rewriting instead of fixing the measured hotspot.
- Adding a list/image library without data.

## Validation Checklist

- [ ] Scenario reproduced + measured (representative build).
- [ ] Bottleneck traced to code.
- [ ] Fixes minimal + behavior-preserving.
- [ ] Re-measured; before/after captured.
- [ ] Residual risks noted.

## Definition of Done

A recorded mobile-performance report: measured bottleneck, safe fix plan (or applied fixes), before/after numbers from a representative build, and residual risks — aligned with `../../performance-review`.

## Related Skills

`../../performance-review`, `../../refactor-planning`, `mobile-state-management`, `mobile-vector-icons`, `mobile-camera-media`, `mobile-unit-testing`

## Related Knowledge

`../../../knowledge/` (hot paths).

## Related References

`../../../references/mobile/screens/`, `../../../references/mobile/state/` when populated.

## Context Loading Guidance

- **Requires:** the slow scenario, measurement (or plan), the hot-path code.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `../../refactor-planning` if the fix is structural.
- **Stop when:** before/after is recorded (or measurement flagged unrun).

## Token Efficiency Guidance

Read only the measured hot path; quote decisive metrics rather than full profiler dumps.
