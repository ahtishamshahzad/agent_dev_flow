# AI Engineering System

**A reusable, tool-neutral operating system for planning and building software with AI agents.** It defines *how* work is classified, planned, approved, implemented, tested, reviewed, and released — without prescribing any application type or technology stack. The stack and applications are chosen per project, with user approval.

It is **documentation and governance**, not application code: no dependencies, no committed stack. It works with **Claude Code, OpenAI Codex, Cursor, Windsurf, GitHub Copilot, Antigravity**, or any agent that can read files.

> Version **1.0.0** · MIT · The full guide lives in [`.ai/README.md`](.ai/README.md).

---

## What's inside

| Layer | Count | Where |
|-------|-------|-------|
| **Skills** (reusable capability modules) | **174** | [`.ai/skills/`](.ai/skills/README.md) |
| **Agents** (roles for multi-agent runs) | 13 | [`.ai/agents/`](.ai/agents/README.md) |
| **Hooks** (tool-neutral lifecycle checklists) | 13 | [`.ai/hooks/`](.ai/hooks/README.md) |
| **Workflows** (per request type) | 12 | [`.ai/workflows/`](.ai/workflows/README.md) |
| **Templates** (fill-in documents) | 25 | [`.ai/templates/`](.ai/templates/README.md) |
| **Prompts** (tool-neutral starters) | 19 | [`.ai/prompts/`](.ai/prompts/README.md) |
| **Checklists** (verifiable gate/hook checks) | 18 | [`.ai/checklists/`](.ai/checklists/README.md) |

Skills are organized into **8 packs**: core (25), mobile (36), web & dashboard (26), backend (30), database (15), testing (14), devops (16), security (12). Plus system rules, knowledge, memory, and references — all in [`.ai/`](.ai/README.md).

## Install

### Claude Code — native plugins

The skills are packaged as installable Claude Code plugins (one per pack):

```
/plugin marketplace add ahtishamshahzad/ai-engineering-system
/plugin install ai-core@ai-engineering-system
```

Add whichever packs a project needs — `ai-mobile`, `ai-web`, `ai-backend`, `ai-database`, `ai-testing`, `ai-devops`, `ai-security`. `ai-core` is the recommended baseline (it has `project-orchestrator`, which drives the whole pipeline). Invoke by namespace: `/ai-core:project-orchestrator`, `/ai-backend:backend-authorization`. See [`plugins/README.md`](plugins/README.md).

### Codex, Cursor, Windsurf, Copilot, Antigravity — copy the files

These read the system through their adapters. Copy `.ai/` plus the entry point and your editor's adapter into a project:

```bash
cp -r .ai AGENTS.md CLAUDE.md /path/to/your-project/
```

| Editor | Adapter it reads |
|--------|------------------|
| Claude Code | `CLAUDE.md` |
| OpenAI Codex / general agents | `AGENTS.md` |
| Cursor | `.cursor/rules/project.mdc` |
| Windsurf | `.windsurf/rules/project.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Antigravity | `AGENTS.md` |

Full options (copy-in vs. submodule/subtree, per-editor matrix): [`INSTALLATION.md`](INSTALLATION.md).

## Use it

Start with a prompt from [`QUICK_START.md`](QUICK_START.md), e.g. a new project:

```
Use the project-orchestrator skill.
This is a new project.
Analyze my requirements, ask missing questions, select required applications,
recommend a stack, generate architecture, dynamic phases, tasks, testing plan
and Git strategy. Store outputs under `.ai/projects/current/`. Do not implement code.
```

The agent reads `CLAUDE.md`/`AGENTS.md` → `.ai/` → loads only the relevant skills. It classifies the request, then walks the pipeline, **stopping at two approval gates** before any code:

```
Request → Classify → Requirements → (Audit if repo exists) → Applications → Stack
──── GATE: you approve applications + stack ────
→ Architecture → Dynamic phases → Tasks
──── GATE: you approve phases + tasks ────
→ Implement → Test → Review → Release
```

## How it works (principles)

- **No code before the approval gates.** Applications and stack are decisions, not defaults.
- **Load only what you need** — the minimum relevant skills, one stage at a time.
- **Everything is enforced server-side**; client checks are UX. Authorization is distinct from authentication and from abuse prevention.
- **Multi-agent is optional** and only for genuinely independent work with non-overlapping file ownership — conflicts are prevented by construction, never used just because it's possible.
- **Reviews report Confirmed vs Potential**, never print secrets, and never claim a system is "secure."
- **`.ai/` is canonical**; editor adapters are thin pointers that never duplicate it.

## Documentation

- [`.ai/README.md`](.ai/README.md) — the complete 23-section usage guide (architecture, all workflows, multi-agent, token efficiency, hooks, MCP, knowledge/memory, git, phases, release, troubleshooting).
- [`QUICK_START.md`](QUICK_START.md) — copy-paste starters.
- [`INSTALLATION.md`](INSTALLATION.md) — install options and per-editor setup.
- [`plugins/README.md`](plugins/README.md) — Claude Code plugin details.
- [`.ai/CHANGELOG.md`](.ai/CHANGELOG.md) — version history.

## Scope

This system **plans and governs** application work. It contains no application code, dependencies, or chosen stack — those live in the project you build with it, decided per project under the approval gates above.

## License

MIT.
