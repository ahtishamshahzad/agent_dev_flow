# Project Logs

> Fill-in template for the three files in `logs/` in `../projects/current/`. Copy each section into its own file. All three are **append-only** — correct an entry with a new dated entry, never by deleting (`../system/PROJECT_MANAGEMENT_RULES.md`).

---

## `DEVELOPMENT-LOG.md`

```markdown
# Development Log

## <YYYY-MM-DD>

- **Work completed:** <one line per outcome>
- **Files changed:** <paths or globs>
- **Tests:** <command run → result> · or "unverified until run"
- **Issues:** <open problems found>
- **Tasks:** <TASK-/FEAT-/TECH- IDs and new status>
- **Bugs:** <BUG- IDs and new status>
```

One entry per significant session. Record only what happened.

---

## `BUG-LOG.md`

The single bug ledger. Each bug's detail lives in `../work-items/bugs/BUG-<NNN>.md`; this table is the index across them.

```markdown
# Bug Log

| ID | Title | Priority | Status | Week | Fix task | Resolution |
|----|-------|----------|--------|------|----------|------------|
| BUG-001 | <> | P1 | OPEN | WEEK-02 | TASK-014 | Pending |
```

Update the row whenever the bug's status, priority, or week changes.

---

## `CHANGE-LOG.md`

Scope and plan changes — what was added, removed, re-prioritized, or re-dated after Gate 4, and why. Not a release changelog: application release notes live in the application.

```markdown
# Change Log

## <YYYY-MM-DD> — <short title>

- **Requested by:** <role>
- **Classification:** existing scope | bug | change request | new feature | technical debt | enhancement
- **SCOPE CHANGE:** yes (approved by <who>, <date>) | no
- **Tasks:** <IDs created or changed>
- **Timeline impact:** <weeks affected / items displaced / none>
```
