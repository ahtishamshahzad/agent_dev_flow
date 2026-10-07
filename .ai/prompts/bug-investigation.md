# Prompt: Bug Investigation

> Tool-neutral starter. Investigate before fixing.

---

Investigate a **bug** (`.ai/` canonical; `.ai/workflows/bugfix.md`, `.ai/skills/bug-investigation`).

**Bug:** <symptom, observed vs expected, where seen>

Do this — **do not fix yet**:
0. Intake (`.ai/skills/project-management`): search `.ai/work-items/bugs/` and the bug log for a duplicate; if new, open `.ai/work-items/bugs/BUG-NNN.md` from `.ai/templates/BUG.md` and add a row to the bug log.
1. Reproduce it (or produce a concrete reproduction plan). If it can't be reproduced, investigate until it can.
2. Find the **root cause**, not the symptom (cite file:line).
3. Scope the **minimal** fix; note the lowest test level that reproduces it.
4. Fill in the bug's `BUG-NNN.md` (reproduction, root cause, P0–P3 priority, planned regression test) — never the template itself. Re-check for a duplicate by root cause. On a tracked project, schedule the fix task into a week.

Run `.ai/hooks/before-bugfix.md`. Report the root cause and the fix plan before implementing.
