---
name: technology-governance
description: Use whenever a technology or version is chosen, added, or changed — new-project baselines (latest stable, verified against official version-matched docs, compatible), existing projects (keep what works; upgrade only for security, end of life, a required feature, or compatibility), version drift, deprecations, and technology decision records.
---

# Technology Governance

## Purpose

Make context-aware technology decisions instead of chasing the newest release. For a **new** project: the latest stable, appropriate technology, verified against current official documentation and checked for compatibility. For an **existing** project: the technology already there, kept unless there is a concrete reason to change it. Rules: `../../system/TECHNOLOGY_GOVERNANCE_RULES.md` — this skill applies them.

`stack-recommendation` decides **what** fits each area; this skill decides **which version, which documentation, and whether to change** what exists.

## When to Use

- A new project's stack is being recommended (with `stack-recommendation`, before Gate 2).
- An existing project is audited (with `existing-project-audit`) — to record its technology baseline.
- A task would add a framework or major dependency, or upgrade, replace, or remove one.
- A dependency is reported vulnerable, end-of-life, or deprecated.
- Someone asks "should we upgrade X?" or "what version should we use?".
- **Not** for adding a small, well-established utility that the existing stack already implies.

## Inputs

- New or existing project (rules §1); the approved requirements and behavior scenarios.
- Existing projects: manifests **and lock files**, runtime config (`.nvmrc`, `engines`, Dockerfile, CI images), framework config.
- Access to registries and official documentation — or an explicit note that it is unavailable.

## Discovery Questions

- Is there a required runtime, platform, or hosting constraint (a client's Node version, an app-store SDK deadline)?
- Is anything mandated (a company standard, an existing contract)?
- For an existing project: is anything currently broken, unsupported, or blocking a requirement?

## Responsibilities

- Classify new vs existing before any technology decision.
- New: establish a **version baseline** — latest stable per area, verified, with the version-matched official docs link and the compatibility chain.
- Existing: record the installed versions; use them; report drift as "available" vs "recommended".
- Escalate security issues; flag deprecations with urgency; route upgrades to migration or scope change.
- Record meaningful decisions in `../../templates/TECHNOLOGY_DECISION.md`.

## Required Workflow

**New project**
1. For each area `stack-recommendation` selects, find the latest **stable** release (registry dist-tags, official releases page); for runtimes, the current LTS.
2. Read its support status and its requirements (engines, peer dependencies).
3. Check the chain: runtime → language → framework → libraries → data layer → build → test → deploy. Resolve conflicts by choosing compatible versions, not by ignoring them.
4. Link the official documentation **for those versions**.
5. Write the baseline (`../../templates/TECHNOLOGY_DECISION.md` — baseline form) and present it with the stack at Gate 2. Anything unverifiable is labelled "unverified".

**Existing project**
1. Record the technology baseline from lock files and runtime config during the audit (Gate 1). For npm projects, run `agentflow drift` (or `npx github:ahtishamshahzad/agent_dev_flow drift`) and quote its table.
2. Ask: can the existing stack deliver this requirement correctly? Yes → use it, with its own version's documentation.
3. If a change seems needed, test it against the triggers in rules §4. No trigger → keep the version and record "upgrade available, not recommended".
4. Trigger present → write the upgrade decision (reason, breaking changes, migration work, regression risk, urgency); protect affected behavior with regression scenarios; inside the task's scope → plan it with `migration-planning`; outside → a separate work item or `SCOPE CHANGE`.
5. A vulnerability affecting the project → bug intake at P0/P1 (`project-management`), now — fixed with the smallest safe version (same major when one exists).

## Decision Rules

- Latest **stable**, never pre-release, unless the user requires it.
- Existing and working, supported, secure, sufficient → keep it.
- Security outranks stability; stability outranks novelty.
- Bug fixes and refactors keep the technology unless it is the root cause or the stated goal.
- Official, version-matched documentation over blogs, tutorials, old answers, and memory.
- Framework-specific official guidance over any general rule here.

## Rules

- Never present a remembered version, API, or command as current without checking it; label what you couldn't verify.
- Never mix APIs or docs from different major versions.
- No silent upgrades or replacements, and none "while you're there".
- Pin what you install; respect lock files.

## Anti-Patterns

- "Always use the latest version."
- Upgrading a working framework because a new major shipped.
- Introducing a second state manager, ORM, or framework next to one that works.
- Copying a setup command from memory for a tool whose CLI changed.
- Following docs for version N+1 in a project on version N.
- Ignoring a critical advisory because "it works".

## Validation Checklist

- [ ] New vs existing decided and recorded.
- [ ] New: each area has a stable version, how and when it was verified, a version-matched docs link, and a compatibility check.
- [ ] Existing: installed versions recorded; existing technology used where it can deliver.
- [ ] Every upgrade names its trigger, breaking changes, migration work, and regression scenarios.
- [ ] Drift reported as available vs recommended; deprecations carry urgency.
- [ ] Nothing version-sensitive taken from memory unlabelled.

## Definition of Done

A recorded decision a reviewer can check: what technology, which exact version, why, verified how and when, documented where — and for existing projects, why it stays or exactly why it changes.

## Related Skills

`stack-recommendation`, `existing-project-audit`, `dependency-audit`, `security/dependency-security`, `migration-planning`, `testing/gherkin-specifications` (regression scenarios around upgrades), `project-management` (security escalation, scope change), `web/web-stack-selection`, `mobile/mobile-stack-selection`, `backend/backend-stack-selection`, `database/database-selection`.

## Related Knowledge

`../../knowledge/` — record verified compatibility findings worth reusing (with source and date).

## Related References

`../../mcp/RECOMMENDED_SERVERS.md` (documentation lookup) · examples: `examples/technology-governance/` in the AgentFlow repository.

## Context Loading Guidance

- **Requires:** the rules file, new-vs-existing status, the areas being decided or the dependency in question.
- **Does not require:** application source beyond manifests, lock files, and configuration.
- **May load:** `stack-recommendation`, `dependency-audit`, `migration-planning`.
- **Stop when:** the decision is recorded and, if needed, routed to Gate 2, a migration work item, or bug intake.

## Token Efficiency Guidance

Check versions with the registry and release pages, not by reading long docs; link documentation instead of quoting it. Record only meaningful decisions.
