# `.ai/work-items/audits/` — Audits

Audit work items: assess and report, usually **without changing code** (or with fixes only when the audit's scope includes them). Covers architecture, security, and testing audits.

## Typical shape

1. **Scope** — what is being audited and against what criteria.
2. **Analyze** — inspect the code/config/state; gather evidence.
3. **Assess** — findings with severity; confirmed vs potential.
4. **Report** — written to `../../generated/audits/` (`../../system/DOCUMENTATION_RULES.md`).

## Audit kinds

- **Architecture review** — boundaries, coupling, scalability, tech debt.
- **Security audit** — per `../../system/SECURITY_RULES.md`; never print secret values; separate confirmed/potential.
- **Testing audit** — coverage, levels, tool fit (`../../system/TESTING_SELECTION_RULES.md`).

## Each audit records

- Title, kind, scope, link to project/phase.
- Findings with severity/status; report location in `../../generated/audits/`.

## Index

_No audits in Phase 1._

| Audit | Kind | Status |
|-------|------|--------|
| _(none yet)_ | — | — |
