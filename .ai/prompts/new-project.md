# Prompt: New Project

> Tool-neutral starter. Paste and fill the brackets. Composes with the canonical rules — it does not replace them.

---

Start a **new project** through the AI Engineering System.

Operate through `.ai/` (canonical). Follow the pipeline in `.ai/system/ORCHESTRATION_WORKFLOW.md` and the gates in `.ai/system/QUALITY_GATES.md`. Use the `new-project` workflow: `.ai/workflows/new-project.md`.

**Request:** <describe what to build, for whom, and why>

Do this, and stop at each approval gate:
1. Classify the request and analyze requirements (`.ai/skills/request-classification`, `requirements-analysis`) → fill `.ai/templates/REQUIREMENTS.md`. If questions block the plan, ask them (about five at most) **together with a provisional applications + stack proposal** under your stated assumptions — labelled provisional, not the Gate 2 decision.
2. Specify the behavior as Gherkin scenarios — success, failure, edge cases (`.ai/system/GHERKIN_RULES.md`, `.ai/skills/testing/gherkin-specifications`).
3. Select applications and recommend the stack per area with justification (`.ai/skills/application-selection`, `stack-recommendation`) → `.ai/templates/APPLICATION_SELECTION.md`, `STACK_RECOMMENDATION.md`. Use the **latest stable** version of each choice, verified against the registry and official version-matched docs — not from memory — and checked for compatibility (`.ai/system/TECHNOLOGY_GOVERNANCE_RULES.md`); label anything you couldn't verify.
4. **Stop for my approval (Gate 2)** of the scenarios, applications, and stack — before architecture or any code.
5. Then architecture (designed to satisfy the scenarios), phases, and tasks → `.ai/templates/ARCHITECTURE.md`, `PHASE_PLAN.md`, `TASK.md`. **Stop for my approval (Gate 4).**

Load only the skills each stage needs (`.ai/system/SKILL_SELECTION_RULES.md`). Do not scaffold or install anything before the gates. List any assumptions and blocking questions.
