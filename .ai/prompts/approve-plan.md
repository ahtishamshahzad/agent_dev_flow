# Prompt: Approve Plan

> Tool-neutral starter. Record a gate approval and proceed.

---

I am reviewing the plan at a **gate** (`.ai/system/QUALITY_GATES.md`).

**Gate:** <2 — behavior scenarios (+ applications + stack) | 4 — phases + tasks>
**Decision:** <approve | approve with changes | reject>
**Changes / conditions (if any):** <>

If approved: record the approval and decision in `.ai/projects/current/` and proceed to the next stage (architecture after Gate 2; implementation after Gate 4). If approved with changes, apply them first and re-present. If rejected, revise and stop for approval again.

Do not proceed past a gate without recorded approval. Do not begin implementation before Gate 4 is approved.
