# Context Management Rules

Load context in **layers**, smallest sufficient set first. Context is a budget; spend it on what the active task needs.

## The context layers

Load from the top only as far down as the task requires:

1. **Global** — `../../AGENTS.md`, `OPERATING_RULES.md`, `ORCHESTRATION_WORKFLOW.md`. Always relevant, kept short.
2. **Project** — `../projects/current/`: selected applications, approved stack, architecture, active phase.
3. **Phase** — the current phase's goal, prerequisites, and exit gate.
4. **Work item** — the active feature/bug/refactor/audit/migration in `../work-items/`.
5. **Task** — the specific task's inputs, outputs, acceptance criteria, and selected skills.
6. **File** — only the files the task actually touches.

Do not jump straight to loading many files. Establish the higher layers first so file-level work is correctly scoped.

## Rules

- **Summarize before expanding.** If a document is large, load or produce a summary before pulling in more context.
- **Prefer links and references** over pasting content. Point to the canonical file.
- **Read only relevant reference folders** (`../references/<topic>/`), not the whole tree.
- **Don't load historical work items** unless the current task needs them.
- **Don't reload canonical rules into adapters** — they're already canonical.
- **Drop context when switching tasks.** Carry forward only decisions, not raw file dumps.
- **Use indexes** (`../skills/README.md`, folder READMEs) to find things without scanning everything.

## When context is getting large

- Write a concise summary of decisions to `../projects/current/` or `../memory/`, then continue from the summary.
- Archive completed generated reports (`../generated/`) so they don't reload.
- Prefer re-deriving from the recorded decision over re-reading the whole history.

## Relationship to token optimization

This file is the **how** of layered loading; `TOKEN_OPTIMIZATION_RULES.md` is the broader economy policy. They agree: load less, summarize, link, and keep durable records concise.
