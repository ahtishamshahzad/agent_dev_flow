# Skill Selection Rules

Select only the skills relevant to the active work. Loading every skill for every task wastes context and degrades focus (`TOKEN_OPTIMIZATION_RULES.md`).

## What a skill is

A **skill** (in `../skills/`) is a reusable capability module: focused instructions for a specific kind of work (e.g. "API design", "list performance", "auth hardening"). Skills are discovered via the `../skills/README.md` **index**, not by scanning every file.

## Selection procedure

1. **Start from the request type and active task**, not the whole project.
2. **Consult the skill index** (`../skills/README.md`) — match by name/description/tags.
3. **Select the minimum set** that covers the task. Prefer 1–3 focused skills over a broad sweep.
4. **Record** which skills are loaded and why, in the task/work-item notes.
5. **Unload** when moving to unrelated work; don't carry a skill into a task it doesn't serve.

## Match signals

Load a skill when the active task's domain, keywords, or files match its description/tags. Examples of signals: the file paths being edited, the request classification, the current phase, the applications in scope.

## When no skill fits

- Proceed with general best practice.
- If the gap recurs, propose a **new skill** (added in a later phase, under approval). Do not invent a skill file mid-task without recording it.

## Anti-patterns

- Loading all skills "to be safe."
- Keeping a skill loaded across unrelated tasks.
- Embedding long code examples in a permanent skill (keep skills instructional; put examples in `../references/` or `../templates/`).
- Duplicating skill content into adapter files.

## Relationship to other rules

- **Phases/tasks** determine *when* a skill is relevant (`PHASE_GENERATION_RULES.md`, `TASK_GENERATION_RULES.md`).
- **Context management** governs *how much* is loaded alongside the skill (`CONTEXT_MANAGEMENT_RULES.md`).
- **Multi-agent** runs may assign different skill sets to different agents (`MULTI_AGENT_RULES.md`).
