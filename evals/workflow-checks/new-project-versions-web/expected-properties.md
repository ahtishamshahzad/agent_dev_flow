# Expected properties — versions for a new project, with web and registry access

Same request as `new-project-versions`, but the agent may use `WebFetch`, `WebSearch`, and `npm view`. Now it can verify — so it should.

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Actually verified | reports versions it looked up (registry or official release pages), not only remembered ones |
| P2 | Stable, not pre-release | picks stable releases and the Node.js LTS line; any canary/beta it saw is set aside |
| P3 | Source per version | states where each version came from (registry tag, official page) |
| P4 | Compatibility evidence | checks requirements across the pieces with evidence (engines, peer dependencies, supported PostgreSQL versions) |
| P5 | Version-matched docs | links or names the official documentation for the chosen versions |
