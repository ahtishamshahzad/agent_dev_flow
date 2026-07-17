# Hook: before-commit

> Tool-neutral checklist run before creating a commit. Read and perform manually; an optional git pre-commit / editor wrapper may invoke the same checks but never replaces this spec (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

Before committing changes (`../system/GIT_WORKFLOW_RULES.md`).

## Required Inputs

- The staged diff and the branch it targets.
- The change's scope and its acceptance criteria.

## Checks

- [ ] **Not committing to the default branch** — a descriptive feature/fix/refactor branch is used.
- [ ] **No secrets** in the diff (scan for keys/tokens/credentials; `../skills/security/secrets-audit`); `.gitignore` respected.
- [ ] Change is **in scope** and coherent (one logical change per commit).
- [ ] Relevant checks run for what's changed (lint/typecheck/tests as available); unrun checks explicitly flagged, not silently skipped.
- [ ] Commit message explains the **why**; authorship/co-author trailers follow the user's stated preference.
- [ ] **Committing was requested/authorized** — never commit unasked.

## Failure Conditions

- Secret detected in the diff.
- Committing directly to main/master.
- Required checks failing (not merely unrun-and-flagged).
- Commit not requested/authorized, or scope incoherent.

## Output

- Confirmation the diff is secret-free, on a proper branch, in scope, checked, and authorized — then the commit.

## Stop Conditions

- **Stop** on any detected secret — remove and (if ever committed) flag for rotation.
- **Stop** if on the default branch — branch first.
- **Stop** if committing wasn't asked for.
- Otherwise proceed to commit.

## Related

- Agent: any implementer + `../agents/release-manager.md`. Rules: `../system/GIT_WORKFLOW_RULES.md`, `SECURITY_RULES.md`.
