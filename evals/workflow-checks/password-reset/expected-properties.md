# Expected properties — password reset

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Scenarios before design | presents Gherkin scenarios before any architecture or implementation detail is settled |
| P2 | Negative cases | includes expired link, already-used link, and invalid link scenarios |
| P3 | Security behavior | includes a scenario that a reset request does not reveal whether an account exists |
| P4 | Approval | stops and asks the user to approve the scenarios (Gate 2) |
| P5 | No code | writes no implementation code |
