# Orchestration Workflow

The end-to-end flow every piece of work follows, from request to release. The orchestrator (the lead agent, or the single agent) drives this. Gates are enforced per `QUALITY_GATES.md`.

## The canonical pipeline

```
Request
  → Request classification
  → Requirement analysis
  → Existing repository audit        (when a repo/codebase already exists)
  → Missing questions                (ask only what blocks progress)
  → Application selection            (what apps does this actually need?)
  → Stack recommendation             (with justification, per area)
  ─────────────── GATE: User approval (applications + stack) ───────────────
  → Architecture
  → Relevant skill selection
  → Dynamic phase generation
  → Task generation
  ─────────────── GATE: User approval (phases + tasks) ───────────────
  → Implementation
  → Testing
  → Review
  → Release
```

**No code before the two approval gates.** See `OPERATING_RULES.md` §2.

## Stage-by-stage

### 1. Request classification
Classify the request as exactly one primary type (see list below). Note secondary types if relevant. The type selects the workflow variant and gates.

**Request types:**
- new project
- existing project enhancement
- feature
- bug
- refactor
- migration
- architecture review
- code review
- security audit
- testing audit
- deployment
- release

Per-type workflows are described in `../workflows/README.md`.

### 2. Requirement analysis
Extract goals, constraints, users, non-functional requirements, and success criteria. Identify unknowns.

### 3. Existing repository audit *(conditional)*
If a codebase exists, audit structure, stack, applications present, tests, security posture, and state **before** proposing changes. Record findings; do not edit yet.

### 4. Missing questions
Ask only the questions that **block** a correct plan. If enough is known, proceed with documented best-practice assumptions and list them.

### 5. Application selection
Independently evaluate which applications the project needs (`APPLICATION_SELECTION_RULES.md`). Do not scaffold everything by default.

### 6. Stack recommendation
Recommend a stack per area with justification (`STACK_DECISION_RULES.md`). Pair databases with data layers correctly; never compare a database against an ORM.

### 🚦 GATE — User approval (applications + stack)
Present applications + recommended stack + assumptions. **Wait for approval.** Record the decision in `../projects/current/`.

### 7. Architecture
Define modules, boundaries, data flow, integration points, and cross-cutting concerns (auth, config, error handling). Keep it proportional to the request.

### 8. Relevant skill selection
Select only the skills the work needs (`SKILL_SELECTION_RULES.md`). Record which are loaded and why.

### 9. Dynamic phase generation
Generate phases from the actual work, not a fixed template (`PHASE_GENERATION_RULES.md`).

### 10. Task generation
Break each phase into concrete, verifiable tasks with inputs, outputs, and acceptance criteria (`TASK_GENERATION_RULES.md`).

### 🚦 GATE — User approval (phases + tasks)
Present phases + tasks. **Wait for approval.** Only now may implementation begin.

### 11. Implementation
Execute approved tasks. Apply hooks (`HOOK_RULES.md`), stay in scope, keep the record current.

### 12. Testing
Apply the testing strategy chosen in `TESTING_SELECTION_RULES.md`. Run what the environment allows; mark unrun checks explicitly.

### 13. Review
Code review + security review (`SECURITY_RULES.md`, `../checklists/`). Separate confirmed issues from potential ones.

### 14. Release
Validate release readiness (`QUALITY_GATES.md` gate 7), follow `GIT_WORKFLOW_RULES.md`. Remote/publish actions require explicit approval.

## Orchestrator responsibilities

- Maintain the current stage and gate status in `../projects/current/`.
- Enforce gates; refuse to advance on failure.
- Decide single-agent vs multi-agent (`MULTI_AGENT_RULES.md`).
- Keep context minimal and layered (`CONTEXT_MANAGEMENT_RULES.md`).
- Collect results, resolve conflicts, run final validation.

## Re-entry

Work resumes from the last recorded stage/gate in `../projects/current/`. Do not restart the pipeline from scratch if state exists.
