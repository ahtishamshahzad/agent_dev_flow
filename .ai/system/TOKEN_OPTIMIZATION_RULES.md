# Token Optimization Rules

Context is finite and costly. These rules keep the system lean without losing correctness. They are canonical and apply to every agent.

## Rules

- **Do not load every skill for every task.** Select only skills relevant to the active work (`SKILL_SELECTION_RULES.md`).
- **Select only relevant skills**, guided by the skill index — not by scanning all files.
- **Load context in layers:** global → project → phase → work item → task → file (`CONTEXT_MANAGEMENT_RULES.md`). Go only as deep as needed.
- **Summarize large documents** before loading additional context.
- **Avoid repeating canonical instructions in adapter files.** Adapters link to `.ai/`; they never restate it.
- **Prefer links and references over duplicated content.**
- **Read only relevant reference folders**, not the entire `../references/` tree.
- **Archive completed generated reports** (`../generated/`) when no longer active so they stop consuming context.
- **Keep progress files concise** — status, decisions, and links, not narration.
- **Use indexes for skill discovery** (`../skills/README.md`).
- **Avoid putting long code examples inside permanent skills.** Keep skills instructional; put examples in `../references/` or `../templates/`.
- **Do not load historical work items** unless they are relevant to the current task.

## Practical habits

- Answer from the recorded decision (`../projects/current/`, `../memory/`) before re-reading source history.
- Quote the minimal snippet needed; don't paste whole files to make one point.
- When a document will be read repeatedly, write a short canonical summary once and reference it.
- Prune stale context on task switches (`CONTEXT_MANAGEMENT_RULES.md`).

## What NOT to sacrifice for tokens

Token economy never justifies:
- Skipping a required quality gate (`QUALITY_GATES.md`).
- Claiming unverified work as done (`OPERATING_RULES.md` §8).
- Omitting a security check to save context (`SECURITY_RULES.md`).

Optimize the *how much you load*, never the *whether you did the work*.
