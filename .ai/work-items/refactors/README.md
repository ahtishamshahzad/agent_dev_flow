# `.ai/work-items/refactors/` — Refactors

Refactor work items: improve structure/quality **without changing external behavior**.

## Typical shape

1. **Audit** — identify the code and the improvement goal.
2. **Plan safe steps** — small, reversible, behavior-preserving increments.
3. **Change** — apply increments; keep behavior identical.
4. **Verify** — tests stay green; behavior unchanged (`../../system/TESTING_SELECTION_RULES.md`).

## Rules

- Behavior-preserving by definition — any intended behavior change is a **feature**, not a refactor.
- Prefer small, independently verifiable steps over a big-bang rewrite.
- Ensure test coverage exists before refactoring risky areas; add it first if missing.

## Each refactor records

- Title & goal, affected area, link to project/phase.
- Step plan; verification approach; risk.

## Index

_No refactors in Phase 1._

| Refactor | Status | Risk |
|----------|--------|------|
| _(none yet)_ | — | — |
