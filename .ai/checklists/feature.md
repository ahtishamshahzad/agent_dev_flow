# Checklist: Feature

> Verifiable items for delivering a feature. Maps to `../hooks/before-feature.md` / `after-feature.md`.

## Pass Criteria

- [ ] Gate 4 approved: tasks with acceptance criteria **written as Gherkin scenarios** (`../system/GHERKIN_RULES.md`); fits existing architecture.
- [ ] Implemented **within the assigned scope**; no scope creep; cross-scope changes routed through the orchestrator.
- [ ] Everything enforced server-side; client checks are UX.
- [ ] **Required cases covered:** happy · invalid input · error · **authorization denial** · regression.
- [ ] Acceptance criteria met; no false completion (`../skills/ai-output-review`).
- [ ] Docs/notes updated; `../templates/PROGRESS.md` current.
- [ ] Ready for code review (+ security review if it touches auth/data/payments).

## Fail / Stop

- Scope exceeds approved tasks; missing required cases; acceptance unmet or overstated.

## Related

Template: `../templates/FEATURE.md`. Workflow: `../workflows/new-feature.md`.
