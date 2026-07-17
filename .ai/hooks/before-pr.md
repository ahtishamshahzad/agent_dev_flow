# Hook: before-pr

> Tool-neutral checklist run before opening a pull request. Read and perform manually; executable integration optional (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

Before opening a PR (`../system/GIT_WORKFLOW_RULES.md`); enforces parts of Gates 5–6.

## Required Inputs

- The branch's full diff, the change's acceptance criteria, and the review/test outputs.

## Checks

- [ ] **Gate 5:** required tests exist and pass (or unrun checks flagged); required cases covered (happy, invalid input, error, **authorization denial**, regression) (`../system/TESTING_SELECTION_RULES.md`).
- [ ] **Gate 6:** code review and security review done; confirmed issues resolved or accepted with rationale; **no critical/high open** (`../system/SECURITY_RULES.md`).
- [ ] No secrets in the branch history (`../skills/security/secrets-audit`).
- [ ] Docs/changelog updated for user-facing changes (`../agents/documentation-engineer.md`).
- [ ] If multi-agent: parallel outputs were **integration-reviewed** as a whole (`../agents/multi-agent-execution.md`).
- [ ] PR description summarizes what/why, testing, and risks; opening the PR is authorized.

## Failure Conditions

- Failing required tests, or missing required-case coverage.
- Open critical/high review/security findings.
- Secret in history; docs stale for a user-facing change.
- Parallel work not integration-reviewed.

## Output

- Confirmation Gates 5–6 are satisfied, history is clean, docs current, integration reviewed — then the PR.

## Stop Conditions

- **Stop** if any required test fails or a critical/high finding is open.
- **Stop** on any secret in history.
- Otherwise open the PR (draft by default for autonomously-opened PRs; never merge unasked).

## Related

- Agents: `../agents/code-reviewer.md`, `../agents/security-reviewer.md`, `../agents/test-engineer.md`, `../agents/release-manager.md`. Rules: Gates 5–6.
