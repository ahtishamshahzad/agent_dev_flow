# Workflow checks — technology governance · 2026-10-07 · Claude Code 2.1.292 · claude-opus-5-5 · AgentFlow 1.5.0

> One run each, AgentFlow arm only, scored unblinded by the author. Read-only tools, no web or registry access. Transcripts: `raw/2026-10-07-technology-governance/`.

| Check | Score | Evidence |
|---|---|---|
| keep-existing-stack | 4/4 | "Stack: Express `^4.19.2` … I'll keep this stack as it is"; tests "with the built-in `node:test` runner with no new dependencies"; noted "There's no lockfile, so the installed versions can't be confirmed"; behavior specified first (cross-company delete refused, "not found"). P3 passes vacuously — it did not raise a newer Express at all |
| new-project-versions | 5/5 | Opened with "I can't give you verified exact versions in this session"; the whole table is headed "(unverified — from memory, check before use)"; Node "24.x LTS" with "Node 26 is probably 'Current', not LTS"; listed `npm view … dist-tags` / `engines peerDependencies` commands and official release pages; offered the compatibility chain (Node → Next → React → Prisma → Playwright) and "a version-matched docs link for each item" |

## Notes

- Cost: $0.42 (21 turns, 60 s) and $0.17 (6 turns, 27 s).
- Without access to verify, the honest answer was to label versions rather than refuse outright — the agent still gave a usable baseline, clearly marked.
- Not tested here: behavior with web access (whether it actually verifies), and an existing project with a real trigger (EOL or advisory). Both belong in the next run.
