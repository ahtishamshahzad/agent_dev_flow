# Usage — Driving the System From Any Editor

How to actually *run* the AI Engineering System once the files are in your project: what to type, in which editor, for a new project and for an existing one.

- New here? Install first — [`INSTALLATION.md`](INSTALLATION.md).
- Want the prompts only? [`QUICK_START.md`](QUICK_START.md).
- Want the full system reference? [`.ai/README.md`](.ai/README.md).

---

## The one rule that makes everything work

**`.ai/` must exist in your project.** Every skill, workflow, and gate references sibling paths inside `.ai/` (`.ai/system/QUALITY_GATES.md`, `.ai/projects/current/`, `.ai/references/<topic>/`), and your project's state is written to `.ai/projects/current/`.

Claude Code plugins are a **discovery convenience** — they make skills invocable by name. They are **not a substitute** for `.ai/` in the project: a plugin's skills resolve their sibling paths inside the plugin's own copy, so with plugins alone your project state would land in the plugin cache and be lost on update.

> **Install the files in every project. Add plugins on top if you use Claude Code.**

## Setup in one command (any editor)

```bash
cd /path/to/your-project
npx github:ahtishamshahzad/agent_dev_flow init                       # all adapters
npx github:ahtishamshahzad/agent_dev_flow init --editor claude,cursor # only what you use
```

Existing files are never overwritten unless you pass `--force`. Preview with `--dry-run`.

---

## Per-editor: what to do, what to type

Every editor runs the **same prompts** — only the entry file and the invocation style differ.

### Claude Code

**Reads:** `CLAUDE.md` → `AGENTS.md` → `.ai/`

Files only (works immediately):

```
Use the project-orchestrator skill. This is a new project.
Analyze my requirements, ask missing questions, select required applications,
recommend a stack, generate architecture, dynamic phases, tasks, testing plan
and Git strategy. Store outputs under `.ai/projects/current/`. Do not implement code.
```

Optional native plugins — adds namespaced, auto-discovered skills:

```
/plugin marketplace add ahtishamshahzad/agent_dev_flow
/plugin install ai-core@agent_dev_flow
```

Then invoke directly: `/ai-core:project-orchestrator`, `/ai-backend:backend-authorization`, `/ai-security:threat-modeling`.

**Install only the packs a project needs.** Every installed pack keeps its skill descriptions in context on every turn — roughly: core ~1.7k, mobile ~2.1k, web ~2.0k, backend ~1.9k, devops ~1.2k, database ~1.0k, testing ~1.0k, security ~0.9k tokens. All eight is ~11.6k tokens of permanent overhead; two or three packs is the sweet spot and matches the system's own "load only what you need" rule.

### Cursor

**Reads:** `.cursor/rules/project.mdc` (`alwaysApply: true`) → `AGENTS.md` → `.ai/`

The rule loads automatically in every chat and Composer session — no command needed. Type the same prompts as above in chat or Composer. To be explicit, reference files with `@`:

```
@AGENTS.md @.ai/README.md
Use project-orchestrator and existing-project-audit. Audit before planning.
Generate the plan under `.ai/projects/current/`. Do not implement code.
```

Skills are plain Markdown here — say "use the `feature-planning` skill" and Cursor reads `.ai/skills/feature-planning/SKILL.md`.

### Windsurf

**Reads:** `.windsurf/rules/project.md` → `AGENTS.md` → `.ai/`

Cascade picks the rule up from `.windsurf/rules/`. If your Windsurf version expects the older single-file format, copy it:

```bash
cp .windsurf/rules/project.md .windsurfrules
```

Then use the same prompts. Confirm it is active by asking: *"Which rules are you following in this workspace?"* — it should name the AI Engineering System and `.ai/`.

### GitHub Copilot

**Reads:** `.github/copilot-instructions.md` → `AGENTS.md` → `.ai/`

Applies to Copilot Chat in VS Code / Visual Studio / JetBrains and to Copilot coding agent. Inline completions do **not** run the pipeline — use **Chat** for planning work:

```
#file:AGENTS.md #file:.ai/README.md
Use project-orchestrator. Classify this request, then plan. Do not implement code.
```

Copilot's context window is smaller — attach only the current skill file rather than whole folders.

### OpenAI Codex

**Reads:** `AGENTS.md` → `.ai/` (native entry point, no adapter file needed)

Codex picks up `AGENTS.md` from the repo root automatically. Nothing to install beyond the files:

```
Follow AGENTS.md. Use project-orchestrator and existing-project-audit.
Inspect the repository before planning changes. Stop at the approval gates.
```

### Antigravity and any other file-reading agent

**Reads:** `AGENTS.md` → `.ai/`

No dedicated adapter exists, and none is needed — `AGENTS.md` is the intended path. Start the session with:

```
Read AGENTS.md, then .ai/README.md and .ai/system/OPERATING_RULES.md, and operate through that system.
```

### At a glance

| Editor | Entry file | Auto-loaded? | Extra step |
|--------|-----------|--------------|------------|
| Claude Code | `CLAUDE.md` | yes | optional `/plugin install` |
| Cursor | `.cursor/rules/project.mdc` | yes (`alwaysApply`) | — |
| Windsurf | `.windsurf/rules/project.md` | yes | copy to `.windsurfrules` on older versions |
| GitHub Copilot | `.github/copilot-instructions.md` | yes (Chat) | use Chat, not inline completion |
| OpenAI Codex | `AGENTS.md` | yes | — |
| Antigravity / other | `AGENTS.md` | manual | point the agent at it once per session |

---

## Flow 1 — A new project

```bash
cd ~/my-new-app
npx github:ahtishamshahzad/agent_dev_flow init --editor claude
```

Then, in your editor:

```
Use the project-orchestrator skill. This is a new project.
Analyze my requirements, ask missing questions, select required applications,
recommend a stack, generate architecture, dynamic phases, tasks, testing plan
and Git strategy. Store outputs under `.ai/projects/current/`. Do not implement code.
```

What happens:

```
Request → Classify → Requirements → Applications → Stack
──── GATE 2: you approve applications + stack ────
→ Architecture → Dynamic phases → Tasks
──── GATE 4: you approve phases + tasks ────
→ Implement → Test → Review → Release
```

Nothing is coded, no dependency is installed, and no stack is committed before you approve both gates. Approve with a plain reply — *"Approved: applications and stack as proposed. Continue to architecture."*

Then work one phase at a time:

```
Read AGENTS.md, current progress, active phase, tasks, relevant skills and references.
Verify dependencies. Implement only the approved phase.
Run validation and update project documents. Stop before the next phase.
```

## Flow 2 — An existing project

```bash
cd ~/my-old-app
npx github:ahtishamshahzad/agent_dev_flow init --editor claude
```

Safe on a populated repo: existing files are skipped, not overwritten. If you already have a `CLAUDE.md` (or `AGENTS.md`) you want to keep, leave it and add one line to it:

```markdown
Operate through the AI Engineering System: read `AGENTS.md`, then `.ai/README.md`.
```

Then:

```
Use project-orchestrator and existing-project-audit.
Inspect the repository before planning changes.
Preserve current conventions unless change is justified.
Generate the plan under `.ai/projects/current/`. Do not implement code.
```

The audit runs **before** any edit — that stop condition is enforced by the workflow ([`.ai/workflows/existing-project.md`](.ai/workflows/existing-project.md)). Gate 2 only fires if the change adds applications or stack; Gate 4 fires for anything non-trivial.

## Flow 3 — Day-to-day work

| You want to… | Say | Lands in |
|--------------|-----|----------|
| Plan a feature | "Use `feature-planning`." | `.ai/work-items/features/` |
| Fix a bug | "Use `project-management`. Fix this bug: …" — it opens `BUG-NNN`, runs `bug-investigation` for the root cause, schedules the fix, then fixes | `.ai/work-items/bugs/` + `logs/BUG-LOG.md` |
| Plan the week | "Use `project-management`. Plan next week." | `.ai/projects/current/weekly/` |
| Check status | "What should I work on this week?" · "What are the current blockers?" · "Update project status." | `.ai/projects/current/CURRENT_STATUS.md` |
| Report | "Prepare weekly report." · "Prepare meeting report." | `.ai/projects/current/reports/` · `meetings/` |
| Refactor | "Use `refactor-planning`." | `.ai/work-items/refactors/` |
| Migrate something | "Use `migration-planning`." | `.ai/work-items/migrations/` |
| Review a change | "Use `code-review`." | review report |
| Security pass | "Use `security-review` and `threat-modeling`." | `.ai/references/security/` |
| Ship it | "Use `git-workflow` and `github-repository`. Do not push without approval." | release record |

More starters: [`.ai/prompts/`](.ai/prompts/README.md).

---

## Where things live

| Path | Holds |
|------|-------|
| `.ai/system/` | Non-negotiable rules — gates, orchestration, security, git, context budget |
| `.ai/skills/` | 178 capability modules, indexed in [`.ai/skills/README.md`](.ai/skills/README.md) |
| `.ai/workflows/` | One per request type (new project, existing project, bugfix, release, …) |
| `.ai/agents/` | 13 roles for multi-agent runs |
| `.ai/hooks/` · `.ai/checklists/` | Tool-neutral lifecycle gates and verifiable checks |
| `.ai/templates/` | Fill-in documents |
| `.ai/projects/current/` | **Your project's state** — classification, decisions, gate status, phases, roadmap, weekly plans, logs, reports |
| `.ai/work-items/` | Features, bugs, refactors, migrations, audits |
| `.ai/references/` | Your project's reference material, by topic — starts empty |
| `.ai/knowledge/` · `.ai/memory/` | Project domain knowledge; retrospectives and lessons |

`.ai/` is canonical. Editor adapters are thin pointers — never copy rules into them.

## Keeping it working

- **Commit `.ai/` with your project.** It is documentation; it belongs in version control.
- **Put project-specific content in `.ai/projects/current/`, `.ai/work-items/`, `.ai/references/`, `.ai/knowledge/`** — not in `.ai/system/` or `.ai/skills/`. That keeps upstream updates mergeable.
- **Update** by re-running the installer with `--force`, then re-checking anything you customised. Version and history: [`.ai/VERSION`](.ai/VERSION), [`.ai/CHANGELOG.md`](.ai/CHANGELOG.md).

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Agent ignores the system | Adapter missing or not loaded | Check the entry file for your editor exists at the repo root; open a fresh session |
| Agent starts coding immediately | Gates skipped | Say: *"Stop. Follow `.ai/system/QUALITY_GATES.md` — no code before Gate 2 and Gate 4."* |
| Agent loads far too much | Whole-tree reading | Say: *"Follow `.ai/system/CONTEXT_MANAGEMENT_RULES.md` — load only the current stage's skill."* |
| Plans vanish between sessions | State not written | Say: *"Record stage and gate status in `.ai/projects/current/` after each stage."* |
| Claude Code plugin skills look empty on Windows | Git did not materialise symlinks | Enable Developer Mode or `git config --global core.symlinks true`, then re-clone; or just use the file install |
| A `.ai/references/<topic>/` folder is empty | Expected | References start empty and are filled as the project develops — agents must not invent content |
