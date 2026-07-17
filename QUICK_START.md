# Quick Start — AI Engineering System

Copy-paste starters for the most common operations. All of them operate through the canonical `.ai/` system (see `.ai/README.md`). They **plan and govern**; they do not write application code, and they **stop at the approval gates**.

> Reminder: no code before Gates 2 (applications + stack) and 4 (phases + tasks); remote/publish/deploy and merges require **explicit approval**; never force-push.

---

## New project

```
Use the project-orchestrator skill.
This is a new project.
Analyze my requirements, ask missing questions, select required applications, recommend a stack, generate architecture, dynamic phases, tasks, testing plan and Git strategy.
Store outputs under `.ai/projects/current/`.
Do not implement code.
```

## Existing project

```
Use project-orchestrator and existing-project-audit.
Inspect the repository before planning changes.
Preserve current conventions unless change is justified.
Generate the plan under `.ai/projects/current/`.
Do not implement code.
```

## Feature

```
Use feature-planning.
Create `.ai/work-items/features/FEATURE_<NAME>.md`.
Do not implement until approved.
```

## Bug

```
Use bug-investigation.
Create `.ai/work-items/bugs/BUG_<NAME>.md`.
Reproduce and identify root cause before changing code.
```

## Start phase

```
Read AGENTS.md, current progress, active phase, tasks, relevant skills and references.
Verify dependencies.
Implement only the approved phase.
Run validation and update project documents.
Stop before the next phase.
```

## GitHub

```
Use git-workflow and github-repository.
Inspect status, history, secrets and approved repository strategy.
Create or push only after explicit approval.
Never force-push.
```

---

## More starters

`.ai/prompts/` has tool-neutral starters for each operation above plus: continue-discovery, approve-plan, refactor-plan, migration-plan, code-review, security-audit, performance-audit, testing-audit, deployment, release, and final-audit. See `.ai/prompts/README.md`.

## What happens next

1. The system classifies the request and analyzes requirements (Gate 1).
2. It selects applications and recommends a stack — **and stops for your approval** (Gate 2).
3. It defines architecture, dynamic phases, and tasks — **and stops for your approval** (Gate 4).
4. Only then does implementation begin, phase by phase, with tests, review, and an approval-gated release.

Full guide: `.ai/README.md`. Installation options: `INSTALLATION.md`.
