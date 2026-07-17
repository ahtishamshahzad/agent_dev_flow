# Knowledge — Security

> Durable, reusable security knowledge. Read only when the task needs it. **Not a tutorial dump.** Every entry carries a trust label; advisories and version-sensitive entries carry the metadata block (**verification date is critical** — security guidance goes stale dangerously) — see `../README.md`. Starts empty.

## What belongs here

- Reusable threat patterns and control patterns with their limits.
- Advisories and vulnerability-class lessons worth remembering, with affected versions.
- Recurring security-failure patterns (e.g. IDOR shapes) and how they were closed.

## What does NOT belong here

- Generic security tutorials — link the source.
- Project-specific findings/reports → `../../generated/` / `../../projects/current/`.
- Canonical rules → `../../system/SECURITY_RULES.md`. **No secrets, credentials, or exploit payloads against third parties.**

## Quality & source requirements

- Reusable, non-obvious; **always cite the source** (advisory, CVE, spec, postmortem) — uncited security claims are **unverified** and must not be relied on.
- Record `verified` date and `affected_versions`; stale security guidance is dangerous — an old `verified` date on a change-prone entry means **re-verify before use**.
- Label trust: verified-current / project-convention / opinion / deprecated / unverified.

## Update & deprecation

- Re-verify frequently against current advisories; mark outdated mitigations **deprecated** with the current guidance.

## How skills reference this

- `../../skills/security/*` link here for advisory/version-sensitive knowledge; the skills stay durable and never declare a system "secure."

## Index

| Document | Topic | Trust | Verified | Affected versions |
|----------|-------|-------|----------|-------------------|
| _(none yet)_ | — | — | — | — |
