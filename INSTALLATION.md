# Installation — AI Engineering System

The AI Engineering System is **primarily repository documentation**: a canonical `.ai/` directory plus thin editor adapters. It contains no application code, dependencies, or chosen stack. Because of that, **package-manager installation is not required or mandatory** — the two supported approaches below are both file-based.

You need: the `.ai/` directory, the entry point `AGENTS.md`, and whichever editor adapters you use (`CLAUDE.md`, `.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md`).

---

## Approach 1 — Dedicated template repository (copy in)

Clone or copy the system into your project. Best when you want a **stable, self-contained** copy that you own and rarely sync.

**Steps**

1. Copy `.ai/`, `AGENTS.md`, and the adapters for your editor(s) into your project root.
2. Commit them alongside your project.
3. Point your editor at the adapter (it reads `.ai/`); start with `QUICK_START.md`.

**Trade-offs**

- ✅ Simple; fully owned; no external dependency; works offline; you can tailor it freely per project.
- ✅ No coupling — your project and the system version don't drift unless you choose to update.
- ⚠️ **Manual updates**: improvements to the upstream system don't reach your project unless you copy them again.
- ⚠️ Local edits can diverge from upstream, making later syncs a manual merge.

**Best for:** most projects; teams that want a frozen, customizable baseline.

---

## Approach 2 — Git submodule / subtree (or package source) for central updates

Bring the system in as a **tracked upstream** so central improvements can be pulled in. Best when several projects should share one evolving copy.

**Options**

- **Git submodule** — reference the system repo at a pinned commit under a path (e.g. `.ai-system/`), then point/symlink your adapters at it. Update by bumping the submodule.
- **Git subtree** — vendor the system into your tree while retaining the ability to pull upstream changes. No extra clone step for contributors.
- **Package source** — if your ecosystem prefers it, consume the system as a versioned source package. This is **optional**, not required; the system is documentation, not a runtime library.

**Trade-offs**

- ✅ **Central updates**: pull upstream improvements across many projects; version is explicit.
- ✅ Clear provenance; easier to keep multiple projects consistent.
- ⚠️ More moving parts: submodules add clone/update steps and can confuse contributors; subtree history is heavier.
- ⚠️ **Local customization is harder** — per-project tailoring fights with staying in sync; keep project-specific content in `projects/current/` rather than editing shared files.
- ⚠️ A package-source approach implies a publish/version cadence you must maintain.

**Best for:** organizations running many projects that want one governed, updatable copy.

---

## Choosing

| Want… | Use |
|-------|-----|
| A simple, owned, offline, freely-customizable copy | **Approach 1** (copy in) |
| Central updates shared across projects, explicit versioning | **Approach 2** (submodule/subtree/source) |
| To avoid mandatory package tooling | Either — both are file-based; package installation is **optional**, never required |

## After installing

- Verify the entry point (`AGENTS.md`) and your editor adapter are present and point to `.ai/`.
- Read `.ai/README.md` (the full guide) and `QUICK_START.md`.
- Keep `.ai/` canonical and adapters thin; put project-specific state in `.ai/projects/current/`.
- Nothing here installs dependencies, selects a stack, or creates a repository — those remain per-project decisions under the system's approval gates.

## Versioning

The system follows semantic versioning (`.ai/VERSION`, `.ai/CHANGELOG.md`). With Approach 2 you pin and bump a version deliberately; with Approach 1 you copy at a point in time and update manually.
