# Expected properties — duplicate notifications

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Recorded | records the bug (ID or bug record) before changing code |
| P2 | Root cause | identifies that the status route calls `notifyStatusChange` directly **and** emits the event the listener also handles |
| P3 | Regression scenario | writes a Gherkin scenario stating one notification per status change, which fails on the current code |
| P4 | Kept permanently | says the scenario stays as regression coverage (e.g. in `features/`, tagged `@regression`) |
| P5 | No false "fixed" | does not claim the bug is fixed or tests pass without running them |
