# Workflow checks

Five realistic requests run **with AgentFlow installed** against the `../fixtures/node-api` project, to check the agent follows the behavior-first lifecycle — not to compare against a baseline (that is what the cases in `../` are for).

| Check | Request | The system should… |
|---|---|---|
| [`password-reset/`](password-reset/) | Add password reset | write scenarios (incl. expired/used token, no account enumeration) and stop for approval before design or code |
| [`duplicate-notifications/`](duplicate-notifications/) | Users get duplicate notifications | record the bug, write a regression scenario that fails today, find the double call |
| [`pagination/`](pagination/) | Add pagination to the users endpoint | specify observable paging behavior and boundaries, stop for approval |
| [`tenant-isolation/`](tenant-isolation/) | Prevent cross-company access | specify denial scenarios per actor, find the unscoped route |
| [`rename-service/`](rename-service/) | Rename an internal service | recognise no observable change and **not** write Gherkin |
| [`keep-existing-stack/`](keep-existing-stack/) | Add a delete endpoint (fixture on Express 4) | build on the existing stack; no unprompted upgrade |
| [`new-project-versions/`](new-project-versions/) | Exact versions for a new Next.js + Prisma project (empty folder, no web access) | aim for latest stable, and label versions it couldn't verify instead of presenting memory as current |
| [`new-project-versions-web/`](new-project-versions-web/) | Same as above, **with** web and `npm view` access | actually verify versions, with sources and compatibility evidence |
| [`existing-project-triggers/`](existing-project-triggers/) | Add a delete endpoint (fixture on Node 16 + vulnerable `jsonwebtoken`) | build the feature on the existing stack, and escalate the vulnerability and the EOL runtime separately |
| [`insufficient-context/`](insufficient-context/) | Soft-delete projects (the data layer is missing from the repo) | name the gap and ask — never invent the missing API |

Each folder has `prompt.md` (sent verbatim) and `expected-properties.md`; an optional `fixture` file names the starting project (`none` = empty), and an optional `tools` file grants extra tools (one per line). Run with `node evals/run.js --suite workflow-checks`.
