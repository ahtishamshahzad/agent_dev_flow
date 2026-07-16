# Hook Rules

Hooks are **reusable workflow gates** — instructions and validation workflows that run at defined points in the lifecycle. They are tool-neutral by default; executable integration is added only where an editor supports it and the user approves.

## Supported hook points

**Before:**
- `before-discovery`
- `before-architecture`
- `before-feature`
- `before-bugfix`
- `before-migration`
- `before-commit`
- `before-pr`
- `before-release`

**After:**
- `after-feature`
- `after-phase`
- `after-pr`
- `after-release`

## What a hook is

A hook is a named checklist/workflow that must pass (or be acknowledged) at its point. Hooks encode gates like: "before commit, secrets scanned and tests run"; "before release, release-readiness gate passed"; "after phase, docs and state updated."

Hook specifications live in `../hooks/` as tool-neutral markdown. Each hook documents:
- **Trigger point** (one of the points above).
- **Purpose.**
- **Checks/steps** (what must be true or done).
- **Pass/fail criteria.**
- **What to do on failure** (block, warn, or record).

## Tool neutrality (important)

- **Do not assume every AI editor supports executable hooks.** Many agents cannot run shell hooks automatically.
- Provide the **tool-neutral specification** under `../hooks/` — an agent reads it and performs the checks manually.
- Provide **editor-specific executable integration only when supported and approved** (e.g. Claude Code hooks in `settings.json`, git hooks). These are thin wrappers that invoke the same specification; they never replace it.

## Relationship to gates

Hooks and quality gates overlap but differ:
- **Gates** (`QUALITY_GATES.md`) are mandatory approval checkpoints in the pipeline.
- **Hooks** are reusable workflows attached to lifecycle events; a `before-release` hook typically *runs the release gate's checks*.

A gate can be enforced via a hook, but the gate's authority comes from `QUALITY_GATES.md`.

## Adding a hook

Later phases may add concrete hook files to `../hooks/`. Each new hook: pick a trigger point, define checks and pass/fail, keep it tool-neutral, and note any optional editor integration separately.
