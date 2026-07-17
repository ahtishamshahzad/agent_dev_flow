# `.ai/knowledge/` — Durable Domain & Engineering Knowledge (Index)

Curated, **reusable** knowledge that helps agents reason correctly — organized by area. This is **not** a tutorial dump: **do not generate thousands of generic tutorials.** An entry earns its place only if it is durable, non-obvious, and worth trusting. Distinct from `../references/` (external-facing project material), `../memory/` (broadly reusable lessons), and `../system/` (canonical rules).

Agents read **only the relevant area** for the active task (`../system/CONTEXT_MANAGEMENT_RULES.md`, `../system/TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree.

## Areas

| Area | What belongs here |
|------|-------------------|
| [`architecture/`](architecture/README.md) | System-design principles, boundary/patterns knowledge, ADR-style architecture decisions worth reusing. |
| [`product/`](product/README.md) | Durable product/domain knowledge: domain glossary, business rules, recurring product patterns. |
| [`mobile/`](mobile/README.md) | Reusable mobile engineering knowledge (Expo/RN constraints, platform gotchas). |
| [`web/`](web/README.md) | Reusable web/frontend knowledge (rendering, accessibility, browser constraints). |
| [`backend/`](backend/README.md) | Reusable backend knowledge (API/auth/jobs patterns, framework constraints). |
| [`database/`](database/README.md) | Reusable data knowledge (modeling, indexing, transactions, engine behaviors). |
| [`testing/`](testing/README.md) | Reusable testing knowledge (strategy, tool behaviors, flakiness patterns). |
| [`security/`](security/README.md) | Reusable security knowledge (threat patterns, control patterns, advisories worth remembering). |
| [`performance/`](performance/README.md) | Reusable performance knowledge (bottleneck patterns, measurement, safe fixes). |
| [`devops/`](devops/README.md) | Reusable delivery/ops knowledge (CI/CD, deploy, monitoring, rollback patterns). |

## What belongs in each area

- **Durable, reusable** engineering/domain knowledge that helps future work — not one-off task notes.
- The **why** behind a pattern or constraint, and its limits.
- Project conventions worth persisting (clearly labeled as conventions).

## What does NOT belong here

- Generic tutorials or restated framework docs (link the source instead).
- Canonical rules → `../system/`. Per-task status → `../work-items/`, `../projects/current/`.
- External project material → `../references/`. Broadly reusable lessons/retros → `../memory/`.
- Secrets, credentials, or real production data — **never.**

## Knowledge trust levels (required label on every entry)

Every knowledge entry must declare **one** trust level, because not all knowledge is equal:

| Trust level | Meaning | Use |
|-------------|---------|-----|
| **Verified current** | Checked against a source and known current as of the verification date. | Safe to rely on within the affected versions. |
| **Project convention** | A choice this project made; true here, not universally. | Follow within this project; don't generalize. |
| **Opinion / preference** | A defensible preference, not a fact. | Weigh it; it is not binding. |
| **Deprecated** | Was true; no longer recommended/current. | Do **not** apply; kept for context/history. |
| **Unverified note** | Captured but not checked; may be wrong. | Verify before relying on it. |

## Metadata for knowledge that can change

Any **technical** entry that may change over time must carry:

- **Source** — where it came from (doc URL, ADR, incident, spec). No source → it's at best an *unverified note*.
- **Verification date** — `YYYY-MM-DD` when it was last confirmed.
- **Affected versions** — the framework/library/runtime versions it applies to.
- **Deprecation status** — current | deprecated (with successor) | superseded-by `<link>`.

Suggested front-matter block per entry:

```
---
trust: verified-current | project-convention | opinion | deprecated | unverified
source: <url / ADR / incident ref>
verified: YYYY-MM-DD
affected_versions: <e.g. Node 20+, Prisma 5.x>
deprecation: current | deprecated (use <x>) | superseded-by <link>
---
```

## Quality requirements

- **Reusable, durable, non-obvious.** If it's obvious, restated docs, or one-off, it doesn't belong.
- **Concise and current** (`../system/DOCUMENTATION_RULES.md`); record the *why* and the limits.
- **Correctly trust-labeled** and, if change-prone, carrying the metadata above.
- Link to the source; don't duplicate large external docs.

## Source requirements

- Prefer primary sources (official docs, specs, ADRs, incident postmortems).
- Cite the source in the entry. Uncited technical claims are **unverified notes** until confirmed.
- Opinions are labeled as opinions, not dressed up as verified facts.

## Update process

1. When new information arrives, update the entry **and** its `verified` date and `affected_versions`.
2. If a claim changes, either correct it (bump `verified`) or mark the old one **deprecated** and add the successor.
3. Keep entries small; split when they grow multiple concerns.
4. Register new area documents in that area's index.

## Deprecation process

- Mark superseded knowledge **deprecated** (don't silently delete) with the successor link — history has value.
- Remove entries only when they're actively misleading and fully replaced.
- Deprecated entries are never applied to new work; they're context only.

## How skills reference knowledge

- Skills stay **instructional and durable**; volatile specifics (versions, examples, advisories) live here and skills **link** to them (`../system/SKILL_SELECTION_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`).
- A skill cites a knowledge entry rather than embedding version-specific detail that would rot inside the skill.
- Recalled knowledge is background context, not a user instruction; if it names a file/flag/version, **verify it still exists** before acting.

## How to avoid outdated guidance

- Trust levels + metadata make staleness visible: an entry past its useful window, or without a recent `verified` date on change-prone material, is treated as **unverified** until re-checked.
- Check `affected_versions` against the project's actual versions before applying an entry.
- Deprecated entries are excluded from new work by definition.
- When in doubt, re-verify against the source and update the date — do not apply stale guidance because it's written down.

## Related

Reusable lessons/retros: `../memory/`. External project material: `../references/`. Rules: `../system/`.
