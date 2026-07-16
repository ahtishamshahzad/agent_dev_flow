# `.ai/projects/` — Per-Project Workspace

Holds the state of projects built with this system. The **active** project lives in `current/`. Completed or paused projects may be archived alongside it.

## Structure

```
projects/
├── current/        # the active project (state, decisions, phases, gate status)
└── <archived>/     # (optional) paused/finished projects, added later
```

## What `current/` holds

See `current/README.md`. In short: request classification, requirements, repo-audit findings, selected applications, approved stack, architecture, generated phases/tasks, and **gate status** — the live record the orchestrator reads and updates.

## Conventions

- One active project in `current/` at a time.
- Keep it concise and current (`../system/DOCUMENTATION_RULES.md`).
- Work resumes from the recorded stage/gate here — the pipeline is not restarted from scratch when state exists.
