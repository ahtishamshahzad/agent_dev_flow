# Task Generation Rules

Break each generated phase into concrete, verifiable **tasks**. Tasks are the unit of execution; they must be small enough to review independently and specific enough to verify.

## A good task has

- **Title** — imperative, specific ("Add ownership check to document GET route").
- **Context** — the minimal background and links (not duplicated content).
- **Inputs** — files, decisions, or prior tasks it depends on.
- **Outputs** — the concrete artifacts it produces (files changed, docs, tests).
- **Acceptance criteria** — how "done" is verified (observable, testable).
- **Required skills** — the loaded skill(s) for this task (`SKILL_SELECTION_RULES.md`).
- **Risk / behavior impact** — low/medium/high; note if it changes product behavior.

## Sizing

- Prefer tasks completable and reviewable in one focused pass.
- Split a task when it spans multiple concerns, files with different owners, or both implementation and large test work.
- Do not create tasks so granular that coordination cost exceeds the work.

## Ordering & dependencies

- Order tasks by dependency within a phase.
- Mark tasks that can run in parallel (candidates for multi-agent, per `MULTI_AGENT_RULES.md`).
- Flag tasks that touch the same files — these must **not** run in parallel across agents.

## Verification is part of the task

Every task names how it will be checked: a command to run, a test to pass, a manual step, or an explicit "unverified until run" if the environment can't execute it. A task is not done until its acceptance criteria are met and verified (or the gap is explicitly flagged).

## Recording

- Tasks live under the relevant `../work-items/` entry (feature/bug/refactor/audit/migration) and are referenced from the phase in `../projects/current/`.
- Keep task notes **concise** (`TOKEN_OPTIMIZATION_RULES.md`): status, decisions, links — not narration.
- Update status as work progresses; don't leave stale "in progress" tasks.

## Output

Tasks are proposed together with phases at the second approval gate. Implementation begins only after that approval (`OPERATING_RULES.md` §2).
