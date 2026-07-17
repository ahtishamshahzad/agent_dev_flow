# Hook: after-pr

> Tool-neutral checklist run after a PR is opened/updated (and around merge). Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

After a pull request is opened or updated, and before/at merge.

## Required Inputs

- The PR, its review threads, CI results, and the merge decision context.

## Checks

- [ ] Review feedback addressed or explicitly deferred with rationale; no unresolved critical/high (`../agents/code-reviewer.md`, `../agents/security-reviewer.md`).
- [ ] CI green (or failures understood and flagged); required checks satisfied.
- [ ] **Merge is authorized** — never merge to the default branch unasked; no force-push (`../system/GIT_WORKFLOW_RULES.md`).
- [ ] Post-merge follow-ups captured (docs, `../projects/current/` state, any cleanup).
- [ ] Branches/worktrees reconciled; conflicts resolved cleanly if the base moved.

## Failure Conditions

- Merging without authorization, or force-pushing/merging over unresolved findings.
- CI red and ignored; review feedback dropped silently.

## Output

- Confirmation the PR is review-clean, CI-green, and (if merging) authorized — with follow-ups recorded.

## Stop Conditions

- **Stop** if merge isn't explicitly authorized, or a critical/high is unresolved, or CI is red without a flag.
- Otherwise proceed (merge only under explicit approval) and record follow-ups.

## Related

- Agents: `../agents/release-manager.md`, `../agents/code-reviewer.md`. Rule: `../system/GIT_WORKFLOW_RULES.md`.
