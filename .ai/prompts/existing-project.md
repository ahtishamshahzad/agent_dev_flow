# Prompt: Existing Project

> Tool-neutral starter. Audit before changing anything.

---

Work on an **existing project** through the AI Engineering System (`.ai/` canonical). Use `.ai/workflows/existing-project.md`.

**Request:** <what to enhance/fix/change>

Start by **auditing before proposing changes** (`.ai/skills/existing-project-audit`, plus `.ai/skills/backend/existing-backend-audit`, `dependency-audit`, `environment-audit` as relevant) → `.ai/templates/AUDIT.md`. Do not edit yet.

Then:
1. Analyze requirements for the change against the audit findings.
2. If behavior changes: find the existing scenarios for the area, then update or add them (`.ai/system/GHERKIN_RULES.md`) and **stop for Gate 2 approval** of them — plus any new applications or stack change.
3. Choose the right sub-workflow (feature / refactor / migration) and plan scoped phases/tasks → `.ai/templates/PHASE_PLAN.md`, `TASK.md`; then Gate 4.

Respect existing architecture, conventions, and **installed technology versions** — don't upgrade or replace working technology without a concrete reason (`.ai/system/TECHNOLOGY_GOVERNANCE_RULES.md`); report newer versions as "available", not as a plan. Load only relevant skills. Report findings, assumptions, and blocking questions.
