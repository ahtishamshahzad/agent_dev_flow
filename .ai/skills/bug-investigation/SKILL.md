---
name: bug-investigation
description: Use to diagnose and plan the fix for a defect — audit, reproduce, find root cause, fix minimally, add a regression test, and validate. Fixes the cause, not the symptom, and pins it so it can't return.
---

# Bug Investigation

## Purpose

Diagnose a defect and plan its fix without regressing behavior: reproduce it, find the true root cause, fix minimally, and pin it with a regression test. Produces a bug work item at `../../work-items/bugs/BUG-<NNN>.md`. Intake (duplicate check, ID, priority, week, ledger) is owned by `project-management`; this skill owns the diagnosis.

## When to Use

- Request classified as **bug**, or a defect surfaced during other work.
- **Not** for new capability (`feature-planning`) or restructuring (`refactor-planning`).

## Inputs

- Symptom description, environment, affected area.
- Repo access; relevant logs/traces if available.

## Discovery Questions

- What is the expected vs actual behavior?
- Exact steps, environment, and build (debug/release) where it occurs?
- Is it consistent or intermittent? Recent change that introduced it?
- Blast radius — who/what is affected, and how severe?

## Responsibilities

- **Audit** the affected area.
- **Reproduce** reliably (or document why not, with evidence).
- Find the **root cause** — the actual mechanism, not the surface symptom.
- Plan a **minimal, behavior-preserving fix** (except for the defect).
- Add a **regression test** that fails before and passes after, specified as a Gherkin scenario stating the reproduction and the observable correct outcome (`testing/gherkin-specifications`).
- Plan **validation** in the relevant build/environment.

## Required Workflow

1. Gather symptoms + environment; confirm the bug has its `BUG-NNN` record and is not a duplicate (`project-management` intake).
2. State the expected behavior: find the existing scenarios for the area (`features/`); if none covers it, write one (`../../system/GHERKIN_RULES.md`).
3. Reproduce (record the repro) and compare expected vs actual. Write the **regression scenario** — it must fail on the current code.
4. Trace to root cause — the fix must explain why the scenario failed.
5. Plan the minimal fix + the regression test that implements the scenario; the scenario stays in `features/` permanently, tagged `@regression @bug-NNN`.
6. Define validation steps, including the regression suite.
7. Record the bug work item (P0–P3 priority, repro, cause, fix, test) and hand back to `project-management` to schedule the fix task and update the ledger.

## Decision Rules

- No fix without a confirmed root cause (or an explicit, justified hypothesis if it can't be reproduced).
- Fix the cause; don't paper over the symptom.
- Every bug gets a regression test (`../../system/TESTING_SELECTION_RULES.md`).
- If the "bug" is actually intended behavior, surface it — don't silently change behavior.

## Rules

- Minimal change footprint; preserve unrelated behavior.
- Distinguish confirmed cause from hypothesis.
- Validate in the environment where the bug appears (e.g. release, not just debug).

## Anti-Patterns

- Symptom-patching without root cause.
- Fixing without a regression test.
- Broad refactors bundled into a bug fix.
- Claiming "fixed" without reproducing/validating.

## Validation Checklist

- [ ] Symptom + environment captured.
- [ ] Reliable repro (or documented non-repro).
- [ ] Root cause identified (confirmed vs hypothesis noted).
- [ ] Minimal fix planned.
- [ ] Regression test defined.
- [ ] Validation steps defined.

## Definition of Done

A recorded bug work item with severity, reproduction, confirmed root cause, a minimal fix plan, a regression test, and validation steps — ready for implementation and verification.

## Related Skills

`existing-project-audit`, `task-planning`, `testing-strategy`, `code-review`, `security-review` (if security-relevant), `project-orchestrator`, `project-management` (intake, scheduling, ledger).

## Related Knowledge

`../../knowledge/` (module behavior, prior incidents).

## Related References

`../../references/<topic>/` only if the failing area needs grounding.

## Context Loading Guidance

- **Requires:** symptom, affected-area code, logs/traces if any.
- **Does not require:** the whole repo, unrelated references, unrelated skills.
- **May load:** `testing-strategy` for the regression test; `security-review` if the bug is security-relevant.
- **Stop when:** cause, fix plan, and regression test are recorded.

## Token Efficiency Guidance

Read only the failing path and its immediate collaborators. Capture the root cause succinctly; don't paste large traces — quote the decisive lines.
