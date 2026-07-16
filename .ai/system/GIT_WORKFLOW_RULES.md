# Git Workflow Rules

How this system uses version control. Tool-neutral; applies to any agent. Remote and publish actions require explicit approval.

## Core rules

- **Never commit or push unless asked.** When work is committable and the user requests it, proceed.
- **Branch off the default branch first.** Do not commit directly to `main`/`master`. Create a descriptive branch (e.g. `feature/…`, `fix/…`, `refactor/…`, `chore/…`).
- **No remote repository creation without explicit approval** (`OPERATING_RULES.md` §9). Phase 1 of this system explicitly does not create a GitHub repository.
- **Small, coherent commits.** One logical change per commit; message explains the *why*.
- **No secrets in commits** (`SECURITY_RULES.md`). Respect `.gitignore`; if a secret was ever committed, flag it for rotation.

## Commit messages

- Imperative subject, concise; body explains reasoning and trade-offs when not obvious.
- Reference the work item where applicable.
- Follow the repository's existing convention (e.g. Conventional Commits) if one is present.
- **Authorship/co-author trailers follow the user's stated preference.** Do not add a co-author trailer the user hasn't asked for.

## Branch & PR flow

1. Branch from the up-to-date default branch.
2. Implement the approved tasks; keep the branch focused.
3. Run the relevant hooks/gates before committing (`HOOK_RULES.md`: `before-commit`, `before-pr`).
4. Open a PR only when asked; PR description summarizes what/why, testing, and risks.
5. `before-pr` / `before-release` hooks enforce testing and security gates (`QUALITY_GATES.md` 5–7).

## Release

- Follow gate 7 (release readiness): tests green, docs and changelog updated, version handled.
- Tagging/publishing/remote pushes are outward-facing actions — **confirm first** unless durably authorized.

## Interactive & destructive operations

- Avoid interactive rebases/`-i` flows and history rewrites unless explicitly requested and safe.
- Destructive commands (`reset --hard`, force-push, branch deletion) require explicit confirmation and a stated reason.

## Relationship to gates and hooks

Git actions are checkpoints, not free actions: `before-commit`, `before-pr`, and `before-release` hooks gate them, and gates 5–7 must pass before the corresponding git action proceeds.
