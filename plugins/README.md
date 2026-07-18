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

- **Single source of truth:** skills live in `../.ai/skills/`; the plugin `skills/` dirs are symlinks. Editing a skill in `.ai/skills/` updates the plugin. On marketplace install, Claude Code dereferences (copies) the symlinked skill content into its plugin cache.
- **Name collisions across packs** (e.g. `database-security` in both `ai-database` and `ai-security`, `playwright-e2e` in both `ai-testing` and `ai-web`) are resolved by plugin namespacing — install both packs and invoke `/ai-database:database-security` vs `/ai-security:database-security`.
- **The plugins do not replace the `.ai/` system.** They expose its skills natively in Claude Code. The full operating rules, gates, agents, hooks, workflows, templates, and references are still in `../.ai/` and are read via `../CLAUDE.md` / `../AGENTS.md`. For non-plugin editors, use the adapters (see `../INSTALLATION.md`).
