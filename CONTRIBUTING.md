# Contributing to AgentFlow

Thanks for helping. This repo is documentation and governance plus a small zero-dependency installer, so most contributions are Markdown — but the same rules apply as to code: one source of truth, verified claims, and a passing check.

## How the repository is laid out

| Path | What it is | Edit it? |
|---|---|---|
| `.ai/` | **The canonical system** — rules, skills, workflows, templates, checklists | Yes — this is where changes go |
| `AGENTS.md`, `CLAUDE.md`, `.cursor/`, `.windsurf/`, `.github/copilot-instructions.md` | Thin adapters that point into `.ai/` | Only to change *where* they point — never copy rules into them |
| `plugins/<pack>/skills` | Symlinks to `.ai/skills/<pack>` | Don't edit; they follow `.ai/` |
| `.claude-plugin/marketplace.json`, `plugins/*/.claude-plugin/plugin.json` | Claude Code plugin manifests | When adding a pack or bumping the version |
| `bin/cli.js` | The `agentflow init` installer | With tests |
| `scripts/validate.js` | Repository consistency checks | When adding something countable or claimable |
| `test/` | Installer tests | With any CLI change |

**One source of truth.** A rule lives in exactly one file under `.ai/system/`; everything else links to it. If you find yourself pasting a rule into a skill, an adapter, or a README, link instead. Duplicates drift — that is how this repo ended up claiming 174 skills when it had 178.

## Add a skill

1. Create `.ai/skills/<name>/SKILL.md` (core) or `.ai/skills/<pack>/<name>/SKILL.md` (domain pack).
2. Frontmatter is required:
   ```yaml
   ---
   name: <name>                # matches the folder
   description: Use to …       # when to use it; keep it short — it is in context on every turn
   ---
   ```
3. Use the standard sections, in order: Purpose · When to Use · Inputs · Discovery Questions · Responsibilities · Required Workflow · Decision Rules · Rules · Anti-Patterns · Validation Checklist · Definition of Done · Related Skills · Related Knowledge · Related References · Context Loading Guidance · Token Efficiency Guidance.
4. Keep the body lean (the median skill is ~1.2k tokens). If a skill has several independent modes, put each in `modes/<mode>.md` and route to it from the body — see `.ai/skills/project-management`.
5. Register it: a row in the pack index (`.ai/skills/README.md` or `.ai/skills/<pack>/README.md`), and an entry in `.ai/skills/SKILLS_INDEX.md` if it answers a new "I want to…".
6. A core skill also needs a symlink: `ln -s ../../../.ai/skills/<name> plugins/ai-core/skills/<name>`. Pack skills are covered by the pack's directory symlink.
7. Update the counts the validator names (README, USAGE, `.ai/README.md`, skill indexes, `plugins/README.md`, `marketplace.json`) and the per-pack context-cost figures if they moved.

## Add a plugin (a new pack)

Add the pack under `.ai/skills/<pack>/` with its own `README.md`, create `plugins/ai-<pack>/.claude-plugin/plugin.json` and a `plugins/ai-<pack>/skills` symlink to it, register it in `marketplace.json` and `plugins/README.md`, and add it to the README pack sentence. The validator checks each of these.

## Version and changelog

Any change to `.ai/` that adopters would see gets a [`.ai/CHANGELOG.md`](.ai/CHANGELOG.md) entry and a version bump (semver: patch = fix, minor = additive, major = breaking a rule or structure). The version lives in `.ai/VERSION` and must match `package.json`, every plugin manifest, `marketplace.json`, `.ai/README.md`, and `README.md`. The newest changelog entry must be the current version and its **Totals** line must match the repo.

## Run the checks

```bash
node scripts/validate.js   # must print OK
npm test                   # Node 18+; includes an install from the packed tarball
```

The validator's rule: **a check that silently stops checking is worse than no check.** If you reword a sentence the validator reads (a count, a version, a token figure), it fails until you update the check — that is deliberate. When you add something countable or claimable, add a check for it.

## Add an evaluation

Evaluations measure whether AgentFlow improves an agent's work, not whether the repo is consistent. See `evals/README.md` for the format and how baseline comparisons work. Never record a result you did not run.

## Publishing to npm (maintainer, when decided)

The package (`agentflow`) is not published yet; installs use `npx github:ahtishamshahzad/agent_dev_flow`. Publishing is public and outward-facing, so it happens only on an explicit maintainer decision:

```bash
git checkout main && git pull           # the released, tagged version
node scripts/validate.js && npm test    # both must pass
npm pack --dry-run                      # inspect the file list (examples/, evals/, plugins/, test/ must be absent)
npm login                               # once per machine
npm publish --access public             # version comes from package.json = .ai/VERSION
```

Afterwards, add `npx agentflow init` as an install option in `README.md`, `USAGE.md`, and `INSTALLATION.md`, and note it in the changelog.

## Pull requests

- One concern per PR, on a branch — never commit to `main`.
- Say what changed, why, and how you verified it. Quote command output; mark anything not run as "unverified".
- `node scripts/validate.js` and `npm test` pass; CI runs them on Node 18, 20, and 22.
- No new dependencies without a reason in the PR.
- Keep honest labels: *proposed*, *generated*, *verified*, *implemented* mean different things here.
