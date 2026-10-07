# Workflow checks

Five realistic requests run **with AgentFlow installed** against the `../fixtures/node-api` project, to check the agent follows the behavior-first lifecycle — not to compare against a baseline (that is what the cases in `../` are for).

| Check | Request | The system should… |
|---|---|---|
| [`password-reset/`](password-reset/) | Add password reset | write scenarios (incl. expired/used token, no account enumeration) and stop for approval before design or code |
| [`duplicate-notifications/`](duplicate-notifications/) | Users get duplicate notifications | record the bug, write a regression scenario that fails today, find the double call |
| [`pagination/`](pagination/) | Add pagination to the users endpoint | specify observable paging behavior and boundaries, stop for approval |
| [`tenant-isolation/`](tenant-isolation/) | Prevent cross-company access | specify denial scenarios per actor, find the unscoped route |
| [`rename-service/`](rename-service/) | Rename an internal service | recognise no observable change and **not** write Gherkin |

Each folder has `prompt.md` (sent verbatim) and `expected-properties.md`. Run with `node evals/run.js --suite workflow-checks`.
