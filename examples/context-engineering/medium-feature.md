# Medium feature — targeted retrieval, one escalation

> **Status: PROPOSED.** Fictional.

**Request:** "Add pagination to the users endpoint." **Budget:** medium.

**Level 1–2:**
- `context suggest "pagination users endpoint"` → no matching scenario (flagged), `src/services/userService.js` (path), `src/app.js` (mentions), skill `rest-api-design` (intent: "Build a backend API").
- Read `userService.listUsers` and the `GET /users` route — the change surface.
- No scenario exists → write them first (default size, last page, invalid size, tenant isolation) and get them approved.

**Escalation to Level 3** — trigger: *the response shape changes; who consumes it?*
- One search for callers of `/users` → `apps/web/src/api/users.ts`. Read that one function, not the web app.
- Decision recorded: breaking change → envelope `{data, nextCursor}`, web client updated in the same change.

**Not loaded:** the rest of the web app, other endpoints, the database schema beyond the `users` columns used for ordering.

**Context pack** (because two apps change):

```yaml
task: { id: FEAT-021, type: feature, budget: medium, level: 3,
        escalations: [{ level: 3, trigger: "response shape change — find consumers" }] }
context:
  required:
    - { path: src/services/userService.js, why: modify }
    - { path: apps/web/src/api/users.ts, why: "only consumer of /users" }
  excluded: [billing, notifications, other endpoints]
```
