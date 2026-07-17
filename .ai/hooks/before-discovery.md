# Hook: before-discovery

> Tool-neutral checklist run at the start of intake, before requirements/audit work begins. An agent reads this and performs the checks manually; executable integration is optional and additive (`../system/HOOK_RULES.md`). **Do not assume executable hook support exists.**

## Trigger

Beginning of a new request's intake — before requirement analysis and any existing-repo audit (`../system/ORCHESTRATION_WORKFLOW.md` stages 1–3).

## Required Inputs

- The user request.
- Access to `../projects/current/` (to detect existing state) and the repo (if one exists).

## Checks

- [ ] Request is captured and can be classified into one primary type (`../skills/request-classification`).
- [ ] Existing project state checked: is there prior work in `../projects/current/` to resume rather than restart?
- [ ] If a codebase exists, an audit is scheduled **before** any change is proposed (`../skills/existing-project-audit`).
- [ ] Scope is bounded enough to analyze (or the ambiguity itself is noted as the first question).

## Failure Conditions

- Request too vague to classify **and** no clarifying question path identified.
- A codebase exists but changes are being proposed before auditing it.
- Existing in-progress state is being ignored (restart-from-scratch risk).

## Output

- Confirmation the request is classifiable, whether prior state exists, and whether an audit is required — recorded for the product-analyst.

## Stop Conditions

- **Stop** if a codebase exists and no audit is planned before edits — audit first.
- **Stop** if the request cannot be classified and no question can unblock it — ask the user.
- Otherwise proceed to requirement analysis.

## Related

- Agent: `../agents/product-analyst.md`. Rule: Gate 1 (`../system/QUALITY_GATES.md`).
