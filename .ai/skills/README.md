# `.ai/skills/` — Reusable Capability Modules (Index)

Skills are focused, reusable instruction modules for specific kinds of work. Agents discover them **through this index**, then load only the relevant ones (`../system/SKILL_SELECTION_RULES.md`). Do not scan every skill file.

## How selection works

1. Match the active task/request-type against the index below.
2. Load the minimum set (prefer 1–3).
3. Record which skills were loaded and why.
4. Unload when moving to unrelated work.

## Skill index

_No concrete skills are defined in Phase 1._ Skills are added in later phases, per need, under approval.

| Skill | Description | Tags | Load when |
|-------|-------------|------|-----------|
| _(none yet)_ | — | — | — |

## Conventions for a skill (when added later)

- One skill = one capability, instructional (not long code dumps — put examples in `../references/` or `../templates/`).
- Include a short description and tags so it's findable from this index.
- Keep it tool-neutral; editors consume it through the canonical `.ai/` path.
- Register every new skill as a row in the table above.
