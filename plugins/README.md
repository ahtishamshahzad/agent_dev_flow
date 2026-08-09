# Claude Code Plugins — AI Engineering System

This directory packages the AI Engineering System's 174 skills as **installable Claude Code plugins**, one per skill pack. The **canonical system remains in `../.ai/`** — each plugin's `skills/` directory is a symlink to the matching pack under `../.ai/skills/`, so there is a single source of truth and no duplication.

The marketplace manifest is at [`../.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json).

## Plugins

| Plugin | Skills | Source |
|--------|--------|--------|
| `ai-core` | 25 | orchestration, planning, selection, review, testing, delivery, audits |
| `ai-mobile` | 36 | React Native / Expo |
| `ai-web` | 26 | web & dashboard |
| `ai-backend` | 30 | backend API |
| `ai-database` | 15 | database & data layer |
| `ai-testing` | 14 | testing |
| `ai-devops` | 16 | CI/CD, deploy, ops |
| `ai-security` | 12 | security review |

Each plugin has `.claude-plugin/plugin.json` and a `skills/` directory that resolves to the canonical pack.

## Install (Claude Code)

Add the marketplace, then install the packs you need:

```
/plugin marketplace add ahtishamshahzad/agent_dev_flow
/plugin install ai-core@agent_dev_flow
/plugin install ai-backend@agent_dev_flow
```

CLI equivalents:

```
claude plugin marketplace add ahtishamshahzad/agent_dev_flow
claude plugin install ai-core@agent_dev_flow
claude plugin list
```

Install only the packs a project needs (this matches the system's "load only what you need" rule). `ai-core` is the recommended baseline — it contains `project-orchestrator`, which drives the whole pipeline.

## Invoking skills

After install, a plugin's skills are namespaced by plugin name and auto-discovered by description. For example:

- `/ai-core:project-orchestrator`
- `/ai-backend:backend-authorization`
- `/ai-security:threat-modeling`

Because skills carry rich `description` frontmatter, Claude will also surface the right skill automatically when a task matches.

## Notes

- **Windows:** the plugin `skills/` directories are git **symlinks**. On Windows, git checks symlinks out as plain text files by default, which breaks the plugins. Enable symlink support before cloning/installing: turn on Windows Developer Mode, then `git config --global core.symlinks true` (or clone with `git clone -c core.symlinks=true …`). WSL works without extra setup.
- **Single source of truth:** skills live in `../.ai/skills/`; the plugin `skills/` dirs are symlinks. Editing a skill in `.ai/skills/` updates the plugin. On marketplace install, Claude Code dereferences (copies) the symlinked skill content into its plugin cache.
- **Name collisions across packs** (e.g. `database-security` in both `ai-database` and `ai-security`, `playwright-e2e` in both `ai-testing` and `ai-web`) are resolved by plugin namespacing — install both packs and invoke `/ai-database:database-security` vs `/ai-security:database-security`.
- **The plugins do not replace the `.ai/` system — install the files too.** Every skill references sibling paths inside `.ai/` (`../../system/QUALITY_GATES.md`, `../../projects/current/`, `../../references/<topic>/`) and records project state in `.ai/projects/current/`. Installed as a plugin, those siblings resolve inside Claude Code's **plugin cache**, not your repo — so a plugin-only setup would write your project's plan into the cache and lose it on the next plugin update. Run the file install in the project as well (`npx github:ahtishamshahzad/agent_dev_flow init`), and the plugins become what they are meant to be: native invocation on top of a project-local system. See [`../USAGE.md`](../USAGE.md).
- **Context cost — install only the packs you need.** Each installed pack keeps every one of its skill descriptions in context on every turn: core ~1.7k, mobile ~2.1k, web ~2.0k, backend ~1.9k, devops ~1.2k, database ~1.0k, testing ~1.0k, security ~0.9k tokens. All eight ≈ **11.6k tokens of permanent overhead**. Two or three packs is the practical sweet spot.
