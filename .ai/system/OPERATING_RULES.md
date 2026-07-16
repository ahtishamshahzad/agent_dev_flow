# Operating Rules

The non-negotiable rules that govern every request handled through this system. All agents obey these regardless of editor or model.

## 1. `.ai/` is canonical

- The `.ai/` directory is the single source of truth.
- `AGENTS.md` is the general entry point; `CLAUDE.md`, Cursor, Windsurf, and Copilot files are **thin adapters** that point into `.ai/`.
- Never duplicate the full system into an adapter file. If instructions change, they change **once**, in `.ai/`.

## 2. Plan before code — gates are mandatory

- No application code, dependency install, or stack commitment happens before the planning gates are approved (see `QUALITY_GATES.md`).
- The required sequence before implementation: classify → analyze → (audit if existing) → ask missing questions → select applications → recommend stack → **user approval** → architecture → select skills → generate phases → generate tasks → **user approval**.
- If a gate's inputs are unresolved, stop and resolve them. Do not "proceed to be helpful."

## 3. Classify every request first

Every request is classified before anything else (see `ORCHESTRATION_WORKFLOW.md` for the list and per-type flows). The classification determines which workflow, gates, and skills apply.

## 4. Applications and stack are decisions, not defaults

- Do not assume a project needs a mobile app, web app, dashboard, backend, or database. Evaluate each independently (`APPLICATION_SELECTION_RULES.md`).
- Do not pick a technology stack silently. Recommend with justification and get approval (`STACK_DECISION_RULES.md`).
- A public web app and an admin dashboard are **separate** decisions.

## 5. Phases are dynamic

- There is no single fixed roadmap. Phases are generated from the selected applications, dependencies, and current state (`PHASE_GENERATION_RULES.md`).

## 6. Load only what the task needs

- Do not load every skill, reference, or work item for every task. Select relevance (`SKILL_SELECTION_RULES.md`, `CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`).
- Prefer links/summaries over duplicated content.

## 7. Multi-agent is optional and controlled

- Use multiple agents only when work divides safely and coordination cost is justified (`MULTI_AGENT_RULES.md`). The orchestrator owns conflict prevention and final validation.

## 8. Be honest and evidence-based

- Distinguish **done and verified** from **proposed** or **assumed**. Report failures with their output.
- Never claim something works without running the relevant check, or explicitly mark it "unverified until run."
- Do not fabricate file paths, commands, or results.

## 9. Do no harm

- Confirm before hard-to-reverse or outward-facing actions (creating remote repos, publishing, deleting, mass edits) unless durably authorized.
- Do not weaken security controls to make something pass (`SECURITY_RULES.md`).
- Do not commit or push unless asked; branch off the default branch first (`GIT_WORKFLOW_RULES.md`).

## 10. Keep the record current

- Decisions, approvals, and phase/task state live in `../projects/current/` and `../work-items/`.
- Durable, reusable decisions go to `../memory/`.
- Generated reports go to `../generated/` and are archived when no longer active (`DOCUMENTATION_RULES.md`).

## 11. Stay in scope

- Do only what the current request and approved plan cover. Surface newly discovered work as a proposed follow-up work item rather than silently expanding scope.

## Definition of "ready to implement"

Implementation may begin only when **all** are true:
- Request is classified and requirements are clear.
- Existing repo audited (if applicable).
- Applications selected and stack approved by the user.
- Architecture is agreed.
- Relevant skills are selected.
- Phases and tasks are generated and approved by the user.
