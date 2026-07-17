# Installation — AI Engineering System

The AI Engineering System is **primarily repository documentation**: a canonical `.ai/` directory plus thin editor adapters. It contains no application code, dependencies, or chosen stack. Because of that, **package-manager installation is not required or mandatory** — the two supported approaches below are both file-based.

You need: the `.ai/` directory, the entry point `AGENTS.md`, and whichever editor adapters you use (`CLAUDE.md`, `.cursor/rules/`, `.windsurf/rules/`, `.github/copilot-instructions.md`).

There are two ways to consume the system, and they compose:

- **A. Native skill install (Claude Code)** — install the skills as Claude Code plugins so they appear as native, namespaced skills (`/ai-core:project-orchestrator`). See "Install as Claude Code plugins" below.
- **B. Repository documentation (all editors)** — copy the files into a project; the editor's adapter directs the agent to operate through `.ai/`. See Approaches 1 and 2 below.

Most users want **both**: the plugins give Claude Code native skill invocation, while the `.ai/` files carry the full operating rules, gates, agents, hooks, workflows, templates, and references that the skills reference.

## Per-editor summary

| Editor / agent | How it uses the system | What you do |
|----------------|------------------------|-------------|
| **Claude Code** | Native plugins **and/or** `CLAUDE.md` → `.ai/` | Install plugins (below) and/or copy `.ai/` + `CLAUDE.md` |
| **OpenAI Codex** | Reads `AGENTS.md` → `.ai/` (native agents entry point) | Copy `.ai/` + `AGENTS.md` into the project |
| **Cursor** | `.cursor/rules/project.mdc` → `.ai/` | Copy `.ai/` + `.cursor/rules/` |
| **Windsurf** | `.windsurf/rules/project.md` → `.ai/` | Copy `.ai/` + `.windsurf/rules/` |
| **GitHub Copilot** | `.github/copilot-instructions.md` → `.ai/` | Copy `.ai/` + `.github/` |
| **Antigravity / other agents** | Read `AGENTS.md` → `.ai/` | Copy `.ai/` + `AGENTS.md` |

> **Codex and other agents need no plugin install** — `AGENTS.md` is their native entry point and already directs them to `.ai/` and the skills index. Just make the files present.

---

## Install as Claude Code plugins (native skills)

The skills are packaged as installable Claude Code plugins — **one plugin per pack** — via the marketplace manifest at `.claude-plugin/marketplace.json`. The canonical skills stay in `.ai/skills/`; each plugin's `skills/` directory symlinks to the matching pack (single source of truth). See [`plugins/README.md`](plugins/README.md).

```
/plugin marketplace add ahtishamshahzad/ai-engineering-system
/plugin install ai-core@ai-engineering-system        # recommended baseline (project-orchestrator)
/plugin install ai-backend@ai-engineering-system     # add the packs you need
/plugin install ai-web@ai-engineering-system
```

CLI equivalents: `claude plugin marketplace add …`, `claude plugin install …@ai-engineering-system`, `claude plugin list`.

Available plugins: `ai-core` (25), `ai-mobile` (36), `ai-web` (26), `ai-backend` (30), `ai-database` (15), `ai-testing` (14), `ai-devops` (16), `ai-security` (12). Install only the packs a project needs — that matches the system's "load only what you need" rule.

After install, skills are namespaced and auto-discovered by description: `/ai-core:project-orchestrator`, `/ai-backend:backend-authorization`, `/ai-security:threat-modeling`.

> The plugins expose the skills natively; they do **not** replace `.ai/`. The full rules/gates/agents/hooks/workflows/templates/references still live in `.ai/` and are read via `CLAUDE.md`/`AGENTS.md`. For a complete setup, install the plugins **and** have `.ai/` present in the project.

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
