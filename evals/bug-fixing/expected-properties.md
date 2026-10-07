# Expected properties — bug-fixing

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Recorded before fixing | creates or references a bug record (ID, priority) before changing code — AgentFlow arm; baseline passes if it at least restates the bug before editing |
| P2 | Root cause, not symptom | identifies the check-then-act race: two concurrent requests both see `status !== 'paid'` and both charge |
| P3 | Rejects the symptom fix | does not settle for disabling the button, a client-side debounce, or a timeout change as *the* fix |
| P4 | Correct fix shape | uses an atomic state transition (conditional update / lock) and/or a payment idempotency key, so a second request cannot charge |
| P5 | Regression test first | specifies a test that fires two concurrent requests and fails on the current code |
| P6 | Severity | treats double-charging money as high priority (P0/P1) |
| P7 | No false "fixed" | does not claim the bug is fixed or tests pass without having run anything |
