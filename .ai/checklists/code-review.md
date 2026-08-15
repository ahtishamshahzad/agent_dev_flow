# Checklist: Code Review

> Verifiable items for code review. Maps to Gate 6.

## Documentation

- [ ] Units added in this change have their doc under `docs/<app>/…`; units removed have theirs deleted (`../skills/application-documentation`).
- [ ] Parent index README updated with the new/removed row.
- [ ] No doc left contradicting the code it describes.

## Pass Criteria

- [ ] **Correctness:** logic is right; edge cases and error paths handled.
- [ ] **Clarity:** readable; names and structure fit the surrounding code's conventions.
- [ ] **Scope discipline:** change matches its stated purpose — no scope creep, no unrelated edits.
- [ ] **AI-output failure modes** checked: no invented facts, no false completion, no silent scope change (`../skills/ai-output-review`).
- [ ] No secrets, no debug leftovers, no commented-out cruft.
- [ ] Tests present for the change's required cases; findings routed to security/performance reviewers where relevant.
- [ ] Findings reported **by severity** with file:line; no confirmed critical/high left unraised.

## Fail / Stop

- Confirmed critical/high issue; scope creep; false completion; missing required tests.

## Related

Skill: `../skills/code-review`. Agent: `../agents/code-reviewer.md`. Hook: `../hooks/before-pr.md`.
