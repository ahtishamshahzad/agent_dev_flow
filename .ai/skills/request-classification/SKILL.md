---
name: request-classification
description: Use at the very start of every request to classify it into one of the system's request types. The classification selects the workflow variant, gates, and which specialist skills apply. Run before requirements analysis or any planning.
---

# Request Classification

## Purpose

Assign each incoming request a primary type (and any secondary types) so the correct workflow, gates, and skills are selected. Classification is the first stage of the pipeline in `../../system/ORCHESTRATION_WORKFLOW.md`.

## When to Use

- As the first action on any new request.
- When a request mixes concerns and its primary intent must be resolved.
- **Not** when the type is already recorded and unchanged in `../../projects/current/`.

## Inputs

- The user request (verbatim) and any attached context.
- `../../system/ORCHESTRATION_WORKFLOW.md` (the type list and per-type flows).

## Discovery Questions

- Is this new work, a change to existing work, or an assessment (no code)?
- Is the intent to add capability, fix a defect, restructure, move state, or evaluate?
- Does it target a release/deploy event?

## Responsibilities

- Select exactly **one primary type** from: new project · existing project enhancement · feature · bug · refactor · migration · architecture review · code review · security audit · testing audit · deployment · release · project tracking.
- Note **secondary types** if the request legitimately spans more than one.
- Map the type to its workflow variant (`../../workflows/README.md`) and gates.
- Record the classification and rationale.

## Required Workflow

1. Read the request and any obvious context.
2. Match intent against the 13 types.
3. Choose the primary type; list secondaries.
4. State the selected workflow/gates that follow.
5. Hand back to `project-orchestrator`.

## Decision Rules

- Prefer the type that captures the **primary outcome**, not the loudest detail.
- "Add X" → feature; "X is broken" → bug; "improve structure, same behavior" → refactor; "move to Y" → migration; "is this OK?" → a review/audit type.
- Assessment-only requests (no code intended) → architecture review / code review / security audit / testing audit.
- "Where are we / what's next / plan the week / prepare the report" → project tracking (`project-management`; no new scope, no gates re-run). If it smuggles in new work, classify that work separately.
- If genuinely ambiguous between two, ask one disambiguating question.

## Rules

- Classify before requirements or planning.
- One primary type; secondaries are explicit, not implied.
- Do not skip classification because the request "seems obvious."

## Anti-Patterns

- Treating every request as "new project."
- Silently blending bug + feature without separating them.
- Jumping to a stack or code before classifying.

## Validation Checklist

- [ ] Primary type chosen from the canonical list.
- [ ] Secondary types noted (or "none").
- [ ] Workflow variant + gates identified.
- [ ] Rationale recorded.

## Definition of Done

The request has a recorded primary type (and any secondaries), with the mapped workflow and gates, ready for `requirements-analysis`.

## Related Skills

`project-orchestrator`, `requirements-analysis`, `existing-project-audit`.

## Related Knowledge

None required.

## Related References

`../../workflows/README.md` (request-type → workflow map).

## Context Loading Guidance

- **Requires:** the request and the type list in `ORCHESTRATION_WORKFLOW.md`.
- **Does not require:** repo source, stack, references, or other skills.
- **May load:** none (returns to orchestrator).
- **Stop when:** the type and workflow are recorded.

## Token Efficiency Guidance

This is a small, fast stage — keep it to the request text plus the type list. Do not load the repo or other skills to classify.
