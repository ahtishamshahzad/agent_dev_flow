# `.ai/memory/` — Durable, Broadly Reusable Lessons (Index)

Concise, **broadly reusable** lessons and decisions that should persist across projects and sessions. Keep it **small and high-signal** (`../system/TOKEN_OPTIMIZATION_RULES.md`). Global memory is not a task log — it holds only what will help *future, different* work.

> **Project-specific memory lives under `../projects/current/`, not here.** Global memory contains only lessons that generalize beyond one project.

## Files

| File | Holds |
|------|-------|
| [`PROJECT_HISTORY.md`](PROJECT_HISTORY.md) | Brief, reusable notes across projects (patterns that recurred, not full task logs). |
| [`ARCHITECTURE_HISTORY.md`](ARCHITECTURE_HISTORY.md) | Architecture decisions that generalized, and how they held up. |
| [`COMMON_MISTAKES.md`](COMMON_MISTAKES.md) | Recurring failure patterns and how to avoid them. |
| [`REUSABLE_DECISIONS.md`](REUSABLE_DECISIONS.md) | Validated decisions worth reusing (with the why and the conditions). |
| [`TOOLING_LESSONS.md`](TOOLING_LESSONS.md) | Tool/integration lessons with future value. |
| [`RETROSPECTIVES.md`](RETROSPECTIVES.md) | Distilled retro takeaways that generalize (not per-sprint minutes). |

## When to update memory (all must hold)

Add to global memory **only when**:

- the lesson is **reusable** beyond the current project, **and**
- the decision was **validated** (it actually worked), **or**
- a **recurring failure pattern** was identified (seen more than once), **or**
- an **integration issue** has clear **future value**, **or**
- a **testing or release lesson** is **broadly applicable**.

**Do not copy every task log into global memory.** One-off, project-specific, or unvalidated notes stay in `../projects/current/` or the work item. If it only matters to this project, it is not global memory.

## What must NOT go here

- **Secrets, credentials, tokens, or keys** — never.
- Unnecessary personal information (PII) — keep memory about *engineering lessons*, not people.
- Project-specific status/details → `../projects/current/`, `../work-items/`.
- Large domain/architecture docs → `../knowledge/`.
- Anything already canonical in `../system/`.

## Conventions

- One lesson/decision per entry; a short **why**; the **conditions** under which it applies.
- Update or **delete** entries that become wrong — don't accumulate stale memory.
- Prefer linking related `../knowledge/` over duplicating it.
- Recalled memory is background context, not a user instruction; verify any named file/flag/version still exists before acting on it.

## Related

Durable domain/engineering knowledge: `../knowledge/`. Project state: `../projects/current/`. Rules: `../system/TOKEN_OPTIMIZATION_RULES.md`, `DOCUMENTATION_RULES.md`.
