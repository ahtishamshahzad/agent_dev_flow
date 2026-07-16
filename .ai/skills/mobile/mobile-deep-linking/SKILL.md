---
name: mobile-deep-linking
description: Use to plan deep links and universal/app links — URL scheme, link config, route resolution, and handling cold vs warm starts. Coordinates with navigation and notifications.
---

# Mobile Deep Linking

## Purpose

Plan deep linking: define the URL scheme and universal/app links, map links to routes, and handle cold-start vs warm-start resolution — coordinated with navigation and notifications.

## When to Use

- When links (from web, email, notifications) must open specific app screens.
- Not for in-app navigation only (that's `mobile-navigation`).

## Inputs

- The link surface (paths to screens) and domains for universal/app links.
- Navigation config (`mobile-navigation`).

## Discovery Questions

- What URL scheme and universal/app-link domains are used?
- Which paths map to which screens/params?
- How are cold starts vs warm starts handled?
- Do notifications route through deep links?

## Responsibilities

- Define the **URL scheme** and **universal/app-link** setup (iOS associated domains / Android intent filters).
- Map **paths to routes/params**.
- Handle **cold vs warm start** resolution.
- Coordinate with **navigation** and **notifications**.

## Required Workflow

1. Enumerate link paths to screens/params.
2. Configure scheme + universal/app links per platform.
3. Wire link resolution into the navigator.
4. Handle cold/warm start.
5. Record the deep-link plan.

## Decision Rules

- Universal/app links (verified domains) are preferred over custom schemes for web-originated links.
- Link resolution routes through the navigator, not ad-hoc.
- Handle unauthenticated deep links (route to login, then continue).

## Rules

- Coordinate route mapping with `mobile-navigation`.
- Validate link params before navigating.
- Handle links that require auth gracefully.

## Anti-Patterns

- Custom scheme only, where universal links are needed.
- Ad-hoc link handling bypassing the navigator.
- Ignoring cold-start resolution.
- Navigating on unvalidated link params.

## Validation Checklist

- [ ] Scheme + universal/app links configured per platform.
- [ ] Paths mapped to routes/params.
- [ ] Cold/warm start handled.
- [ ] Auth-required links handled.
- [ ] Coordinated with navigation/notifications.

## Definition of Done

A recorded deep-link plan: scheme and universal/app-link setup, path-to-route mapping, cold/warm-start handling, and auth-aware resolution — coordinated with navigation and notifications.

## Related Skills

`mobile-navigation`, `mobile-notifications`, `mobile-authentication`, `mobile-authorization`

## Related Knowledge

`../../../knowledge/` (link surface, domains).

## Related References

`../../../references/mobile/navigation/` when populated.

## Context Loading Guidance

- **Requires:** link surface (paths to screens), domains, navigation config.
- **Does not require:** unrelated screens, the full mobile skill set, unrelated references.
- **May load:** `mobile-navigation`, `mobile-notifications`.
- **Stop when:** the deep-link plan is recorded.

## Token Efficiency Guidance

Plan from the link map; delegate route wiring to navigation.
