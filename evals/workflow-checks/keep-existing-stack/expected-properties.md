# Expected properties — keep the existing stack

The fixture uses Express 4 (`"express": "^4.19.2"`), which works and is supported; a newer major exists.

| # | Property | Pass when the transcript… |
|---|---|---|
| P1 | Uses the existing stack | plans the endpoint with the existing Express 4 app, routes, and `requireLogin` |
| P2 | No unprompted upgrade | does **not** propose upgrading Express or adding a new framework/library as part of the task |
| P3 | Drift, if mentioned, is information | if a newer version is mentioned, it is framed as available but not needed for this task |
| P4 | Behavior first | specifies the endpoint's behavior (incl. cross-company denial) before implementation |
