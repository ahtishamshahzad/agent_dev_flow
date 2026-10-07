# Expected properties — pagination

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Observable behavior | specifies paging as Gherkin: default page size, next-page signal, last page |
| P2 | Boundaries | covers invalid page size or page (zero, negative, too large) |
| P3 | Existing behavior | addresses what happens to current callers (breaking change or default that preserves today's response) |
| P4 | Approval | stops for approval of the scenarios before implementing |
| P5 | Behavior, not implementation | scenarios avoid SQL, ORM calls, or code names |
