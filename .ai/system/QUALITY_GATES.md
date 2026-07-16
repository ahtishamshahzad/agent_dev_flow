# Quality Gates

Gates are **mandatory checkpoints**. A phase cannot move forward when its required gate fails. Gates are where the user approves, and where the system refuses to cut corners.

## The seven gates

### Gate 1 — Requirements
**Passes when:** the request is classified, requirements and success criteria are clear, unknowns are either resolved or explicitly assumed, and (if a repo exists) it has been audited.
**Blocks:** application selection until requirements are understood.

### Gate 2 — Application & stack approval
**Passes when:** applications are selected with justification (`APPLICATION_SELECTION_RULES.md`) and the stack is recommended per area (`STACK_DECISION_RULES.md`), **and the user approves**.
**Blocks:** architecture and any implementation. *(This is a user-approval gate.)*

### Gate 3 — Architecture
**Passes when:** module boundaries, data flow, integration points, and cross-cutting concerns are defined and consistent with the approved applications/stack.
**Blocks:** phase/task generation from proceeding on an unresolved architecture.

### Gate 4 — Implementation readiness
**Passes when:** phases are generated dynamically (`PHASE_GENERATION_RULES.md`), tasks are defined with acceptance criteria (`TASK_GENERATION_RULES.md`), relevant skills are selected, **and the user approves**.
**Blocks:** all coding until approved. *(This is a user-approval gate.)*

### Gate 5 — Testing
**Passes when:** the testing strategy (`TESTING_SELECTION_RULES.md`) is applied, required tests exist and pass (or unrun checks are explicitly flagged), and acceptance criteria are met.
**Blocks:** review/release on failing or missing required tests.

### Gate 6 — Security & quality review
**Passes when:** code review and security review are complete (`SECURITY_RULES.md`, `../checklists/`), confirmed issues are resolved or accepted with rationale, and no critical/high issue is left open.
**Blocks:** release.

### Gate 7 — Release readiness
**Passes when:** release criteria are met — tests green, docs updated, version/changelog handled, git workflow followed (`GIT_WORKFLOW_RULES.md`), and any remote/publish action is explicitly approved.
**Blocks:** shipping.

## Enforcement

- The orchestrator records each gate's status in `../projects/current/`.
- On failure: **stop**, report what failed with evidence, and either fix or return to the user. Do not advance.
- Gates 2 and 4 require **explicit user approval** — assumptions cannot substitute for it.

## Gate ↔ hook mapping

Gates are commonly enforced via hooks (`HOOK_RULES.md`): e.g. `before-architecture` → Gate 1/2 satisfied; `before-commit`/`before-pr` → parts of Gates 5–6; `before-release` → Gate 7.
