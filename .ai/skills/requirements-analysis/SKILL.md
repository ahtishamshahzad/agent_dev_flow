---
name: requirements-analysis
description: Use after classification to extract goals, constraints, users, and success criteria from a request, and to separate confirmed facts from assumptions and open questions. Produces the requirement baseline the rest of the plan depends on.
---

# Requirements Analysis

## Purpose

Turn a request into a clear requirement baseline: what must be true for success, for whom, under what constraints — with confirmed facts, assumptions, and blocking questions kept explicitly separate.

## When to Use

- After `request-classification`, before application selection.
- When a request's scope, users, or success criteria are not yet explicit.
- **Not** for a fully-specified trivial change with obvious acceptance criteria.

## Inputs

- Classified request and attached context.
- Existing-repo audit findings (if any) from `existing-project-audit`.

## Discovery Questions

- Who are the users/actors, and what do they need to accomplish?
- What does success look like (measurable where possible)?
- What are the hard constraints (platform, timeline, budget, compliance, existing systems)?
- What is explicitly out of scope?
- Any non-functional needs (performance, security, availability, accessibility)?

## Responsibilities

- Extract functional and non-functional requirements.
- Produce three explicit lists: **Confirmed facts**, **Assumptions**, **Open questions**.
- Define success criteria that later acceptance criteria can trace to.
- Flag risks and unknowns that affect application/stack choices.

## Required Workflow

1. Read the classified request + audit findings.
2. Draft functional + non-functional requirements.
3. Sort every statement into Confirmed / Assumption / Question.
4. Define success criteria, and write each acceptance criterion **as** a Gherkin scenario or map it one-to-one to one (`../../system/GHERKIN_RULES.md`) — e.g. "valid reset token works · expired token rejected · invalid token rejected" become three scenarios. Requirements and scenarios must never contradict.
5. Surface blocking questions to the user; proceed on stated assumptions for non-blocking gaps.
6. Record the baseline in `../../projects/current/`.

## Decision Rules

- A statement is **Confirmed** only if the user stated it or the repo proves it; otherwise it's an **Assumption**.
- Ask only questions whose answers change the plan; document the rest as assumptions.
- Non-functional requirements (security, PII, scale) feed phase and testing generation — never drop them.

## Rules

- Keep the three lists distinct and visible through planning.
- Do not invent requirements to fill gaps — mark them assumptions.
- Tie success criteria to observable outcomes.

## Anti-Patterns

- Blending assumptions into "facts."
- Endless clarifying questions that block progress on non-blocking points.
- Gold-plating: adding requirements the user never asked for.

## Validation Checklist

- [ ] Functional requirements captured.
- [ ] Non-functional requirements captured (security/PII/scale/etc.).
- [ ] Confirmed / Assumptions / Questions lists explicit.
- [ ] Success criteria defined and measurable where possible.
- [ ] Blocking questions raised; assumptions stated for the rest.

## Definition of Done

A recorded requirement baseline with success criteria and the three separated lists, sufficient for `application-selection` and `stack-recommendation` to proceed.

## Related Skills

`request-classification`, `existing-project-audit`, `application-selection`, `stack-recommendation`, `project-orchestrator`.

## Related Knowledge

`../../knowledge/` (domain glossary/business rules, if present).

## Related References

Relevant `../../references/<topic>/` only if a domain needs grounding.

## Context Loading Guidance

- **Requires:** the classified request, audit findings (if any), success-criteria intent.
- **Does not require:** stack details, other skills' bodies, unrelated references.
- **May load:** `existing-project-audit` output; a single domain reference folder if needed.
- **Stop when:** the baseline and three lists are recorded.

## Token Efficiency Guidance

Summarize source material into the three lists rather than quoting it wholesale. Load a reference folder only if the domain is genuinely unclear.
