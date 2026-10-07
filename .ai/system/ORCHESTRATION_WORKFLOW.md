# Orchestration Workflow

The end-to-end flow every piece of work follows, from request to release. The orchestrator (the lead agent, or the single agent) drives this. Gates are enforced per `QUALITY_GATES.md`.

## The canonical pipeline

```
Request
  → Request classification
  → Requirement analysis
  → Existing repository audit        (when a repo/codebase already exists)
  → Missing questions                (ask only what blocks progress)
  → Behavior specification           (Gherkin: what changes, success, failure, edge cases)
  → Application selection            (what apps does this actually need?)
  → Stack recommendation             (with justification, per area)
  ──────── GATE: User approval (behavior + applications + stack) ────────
  → Architecture                     (designed to satisfy the scenarios)
  → Relevant skill selection
  → Dynamic phase generation
  → Task generation                  (each task names the scenarios it delivers)
  ─────────────── GATE: User approval (phases + tasks) ───────────────
  → Project tracking setup           (roadmap, IDs, weekly plan)
  → Implementation                   (week by week, against approved scenarios)
  → Testing                          (every scenario → a named, passing test)
  → Review
  → Release                          (every @critical scenario verified)
```

**No code before the two approval gates.** See `OPERATING_RULES.md` §2. **No behavior change without approved Gherkin** — the contract and its exceptions are in `GHERKIN_RULES.md`.

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
- project tracking — status, week planning/review, blockers, weekly or meeting report (no new scope; handled by `../skills/project-management`, no gates re-run)

Per-type workflows are described in `../workflows/README.md`.

### 2. Requirement analysis
Extract goals, constraints, users, non-functional requirements, and success criteria. Identify unknowns.

### 3. Existing repository audit *(conditional)*
If a codebase exists, audit structure, stack, applications present, tests, security posture, and state **before** proposing changes. Record findings; do not edit yet.

### 4. Missing questions
Ask only the questions that **block** a correct plan. If enough is known, proceed with documented best-practice assumptions and list them.

### 4a. Behavior specification
Does the request change observable behavior? If not (formatting, renames, proven zero-change refactors), record that and skip. If it does — or it's unclear — answer: what behavior changes, who is affected, what success and failure look like, which edge cases matter (invalid, unauthorized, duplicate, concurrent, offline, timeout, external failure), and what must stay unchanged. Find the existing scenarios first; then write or update them (`GHERKIN_RULES.md`, `../skills/testing/gherkin-specifications`). Acceptance criteria are these scenarios.

### 5. Application selection
Independently evaluate which applications the project needs (`APPLICATION_SELECTION_RULES.md`). Do not scaffold everything by default.

### 6. Stack recommendation
Recommend a stack per area with justification (`STACK_DECISION_RULES.md`). Pair databases with data layers correctly; never compare a database against an ORM.

### 🚦 GATE — User approval (behavior + applications + stack)
Present the scenarios, plus applications and stack when they are new or changing, plus assumptions. **Wait for approval.** Record the decision in `../projects/current/`. This gate fires for **every behavior change** — a feature on an existing app approves its scenarios here even when no application or stack changes.

### 7. Architecture
Define modules, boundaries, data flow, integration points, and cross-cutting concerns (auth, config, error handling) — **driven by the approved scenarios**: each scenario's preconditions, failures, and edge cases must have a home in the design. Keep it proportional to the request.

### 8. Relevant skill selection
Select only the skills the work needs (`SKILL_SELECTION_RULES.md`). Record which are loaded and why.

### 9. Dynamic phase generation
Generate phases from the actual work, not a fixed template (`PHASE_GENERATION_RULES.md`).

### 10. Task generation
Break each phase into concrete, verifiable tasks with inputs, outputs, and acceptance criteria (`TASK_GENERATION_RULES.md`). Each task names the approved scenarios it delivers; a task with behavior but no scenario sends that behavior back to 4a.

### 🚦 GATE — User approval (phases + tasks)
Present phases + tasks. **Wait for approval.** Only now may implementation begin.

### 10a. Project tracking setup
Hand the approved phases and tasks to `../skills/project-management`: assign IDs, estimates, and dependencies; write the roadmap and the first week's plan (`PROJECT_MANAGEMENT_RULES.md`). This schedules approved work — it approves nothing new.

### 11. Implementation
Execute approved tasks, week by week. Bugs found or reported along the way go through bug intake (ID, priority, week, ledger) before any fix; new scope is classified and, if it changes the approved plan, flagged `SCOPE CHANGE` for approval. Log each significant session and keep the week and status current. Build only what the approved scenarios specify — behavior they don't cover stops for classification (`GHERKIN_RULES.md`, scope control). Apply hooks (`HOOK_RULES.md`), stay in scope, keep the record current.

### 12. Testing
Apply the testing strategy chosen in `TESTING_SELECTION_RULES.md`. Every approved scenario maps to a named test that passes; then run the regression suite. Run what the environment allows; mark unrun checks explicitly.

**Bugs** take a shorter path (`../workflows/bugfix.md`): reproduce → find existing scenarios → expected vs actual → regression scenario that fails today → root cause → fix → its test passes → regression suite → the scenario stays.

### 13. Review
Code review + security review (`SECURITY_RULES.md`, `../checklists/`). Separate confirmed issues from potential ones.

### 14. Release
Validate release readiness (`QUALITY_GATES.md` gate 7) — including every release-blocking `@critical` scenario verified by a passing test — and follow `GIT_WORKFLOW_RULES.md`. Remote/publish actions require explicit approval.

## Orchestrator responsibilities

- Maintain the current stage and gate status in `CURRENT_STATUS.md` in `../projects/current/`.
- Enforce gates; refuse to advance on failure.
- Decide single-agent vs multi-agent (`MULTI_AGENT_RULES.md`).
- Keep context minimal and layered (`CONTEXT_MANAGEMENT_RULES.md`).
- Collect results, resolve conflicts, run final validation.

## Re-entry

Work resumes from the last recorded stage/gate in `CURRENT_STATUS.md` in `../projects/current/` — read it first; it points to the current phase, week, and open work. Do not restart the pipeline from scratch if state exists.
