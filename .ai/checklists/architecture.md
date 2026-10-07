# Checklist: Architecture

> Verifiable items for architecture. Maps to Gates 2–3 and `../hooks/before-architecture.md`.

## Pass Criteria

- [ ] Applications selected with justification; nothing auto-scaffolded.
- [ ] Stack recommended **per area** with alternatives; database paired with a data layer (no DB-vs-ORM comparison).
- [ ] **Gate 2 user approval recorded** for the behavior (Gherkin scenarios) and, when new or changing, applications + stack.
- [ ] Every approved scenario's preconditions, failures, and edge cases have a home in the design (`../system/GHERKIN_RULES.md`).
- [ ] Module/domain boundaries, data flow, and integration points defined.
- [ ] Cross-cutting concerns addressed: authN/authZ (server-enforced), validation, error handling, config/secrets, observability.
- [ ] A **domain → file-ownership boundary map** exists (enables disjoint parallel agents).
- [ ] Architecture is consistent with the approved apps/stack and proportional to the request.

## Fail / Stop

- Architecture started without recorded Gate 2 approval.
- Incoherent stack pairing, or code already written pre-gate.

## Related

Template: `../templates/ARCHITECTURE.md`. Skill: `../skills/architecture-design`. Parallel rules: `../agents/multi-agent-execution.md`.
