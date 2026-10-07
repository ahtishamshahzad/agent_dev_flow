# Prompt: Bug Implementation

> Tool-neutral starter. Apply a fix with a failing-first regression test.

---

Implement the **bug fix** for the investigated root cause (`.ai/templates/BUG.md`, `.ai/workflows/bugfix.md`).

Do this:
1. Write a **regression test that fails on the current (unfixed) code** at the lowest level that captures the bug (`.ai/skills/testing/regression-testing`; if it's a vulnerability, also `.ai/skills/security/security-regression-testing`).
2. Apply the **minimal** fix addressing the root cause — no bundled refactors.
3. Confirm the test now passes and nearby behavior is unchanged.
4. Land the regression test in the CI-gated suite.

5. Move the bug to `FIXED` (and `VERIFIED`/`CLOSED` only once true) in its `BUG-NNN.md` and the bug log; on a tracked project also update the week, the development log, and `CURRENT_STATUS.md` (`.ai/skills/project-management`).

Run `.ai/hooks/before-commit.md` / `before-pr.md`. Do not merge unasked. Report what changed and the test that guards it.
