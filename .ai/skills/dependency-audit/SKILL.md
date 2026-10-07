---
name: dependency-audit
description: Use to inventory and assess a project's dependencies — versions, known vulnerabilities, unused/duplicate packages, license and maintenance risk, and heavy additions. Recommends changes with justification; never bloats the tree "to be safe."
---

# Dependency Audit

## Purpose

Understand and assess the dependency tree: what's installed, its risk (vulnerabilities, maintenance, license), and whether additions are justified — so the project stays lean and safe.

## When to Use

- During an existing-project audit or before a migration.
- When evaluating whether to add a dependency.
- For a security/quality pass touching supply chain.
- **Not** to add packages speculatively.

## Inputs

- The manifest and lockfile (read-only).
- The task's need (for add/remove decisions).

## Discovery Questions

- What does each major dependency provide, and is it still used?
- Any known advisories (from `npm/pnpm/yarn audit` or equivalent)?
- Are there duplicates, unused, or abandoned packages?
- Does a proposed addition justify its weight/lock-in?

## Responsibilities

- Inventory dependencies and versions from manifest + lockfile.
- Identify **known vulnerabilities** (advisories) and their severity.
- Flag **unused, duplicate, or abandoned** packages.
- Assess **license and maintenance** risk.
- Judge **new additions** on need vs weight/lock-in.
- Recommend changes with justification (no unrequested installs).

## Required Workflow

1. Read manifest + lockfile.
2. Run available advisory tooling; quote results (or mark "unverified until run").
3. Identify unused/duplicate/abandoned packages.
4. Assess license/maintenance risk.
5. Recommend add/remove/upgrade with justification. Report drift as **available vs recommended**: a newer version is not by itself a reason — recommend an upgrade only for a trigger in `../../system/TECHNOLOGY_GOVERNANCE_RULES.md` §4 (vulnerability, end of life, required feature, compatibility, deprecation), with its urgency.

## Decision Rules

- Address Critical/High advisories before release (`../../system/SECURITY_RULES.md`).
- Prefer removing/upgrading over adding.
- A new dependency needs a clear need and a weight/lock-in note.
- Don't upgrade blindly across majors — flag breaking changes (feeds `migration-planning`).

## Rules

- Read-only inventory; no installs without approval.
- Quote advisory output; flag unrun checks.
- Don't add packages "to be safe."

## Anti-Patterns

- Bloating the tree with convenience libraries.
- Ignoring advisories.
- Blind major upgrades without a migration plan.
- Claiming a clean tree without running audit tooling.

## Validation Checklist

- [ ] Dependencies + versions inventoried.
- [ ] Advisories checked (or flagged unrun).
- [ ] Unused/duplicate/abandoned flagged.
- [ ] License/maintenance risk assessed.
- [ ] Add/remove/upgrade recommendations justified.

## Definition of Done

A dependency report: inventory, advisories with severity, unused/duplicate/abandoned findings, license/maintenance risks, and justified recommendations — with no unapproved installs.

## Related Skills

`existing-project-audit`, `environment-audit`, `security-review`, `migration-planning`, `stack-recommendation`, `final-quality-audit`.

## Related Knowledge

`../../knowledge/` (stack decisions).

## Related References

`../../mcp/RECOMMENDED_SERVERS.md` if a tool is needed.

## Context Loading Guidance

- **Requires:** manifest + lockfile; the add/remove need if relevant.
- **Does not require:** full source, unrelated references, planning skills' bodies.
- **May load:** `security-review` for advisory severity; `migration-planning` for upgrades.
- **Stop when:** the dependency report is recorded.

## Token Efficiency Guidance

Work from the manifest/lockfile and tool output, not the whole codebase. Summarize; quote only decisive advisory lines.
