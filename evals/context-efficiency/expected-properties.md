# Expected properties — context efficiency

Scored from the transcript (quality). Efficiency is measured separately by the runner (files read, tool calls, tokens) — see `evaluation.md`.

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Root cause | identifies that the ship route both emits `order.shipped` and calls `sendShippedEmail` directly, while the subscriber also sends on that event |
| P2 | Locates it | names the files involved (the orders route and the notifications subscriber) |
| P3 | Minimal fix | proposes removing one of the two sends (not adding dedup machinery or new libraries) |
| P4 | Regression protection | specifies a test or scenario that one ship produces exactly one email |
| P5 | No unverified claims | does not claim the fix works or tests pass without running them |
| P6 | No unnecessary scope | does not propose changes to unrelated modules |
