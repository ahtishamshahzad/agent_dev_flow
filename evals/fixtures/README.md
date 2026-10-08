# Fixtures

Starting code copied into each run's fresh temp project. **The gaps are deliberate** — this note stays outside the copied folder so the agent isn't told.

| Fixture | Planted for |
|---|---|
| `node-api-legacy/` | Same code, plus real upgrade triggers: Node 16 (end of life), `jsonwebtoken` 8.5.1 (advisories, fixed only in 9.x), `express` 4.19.2 (a low advisory fixed in 4.20.0) — with a lock file |
| `node-api/` | `GET /users` has no pagination · `GET /projects/:id` has no company check (cross-tenant read) · a status change emails the customer twice (the event listener and the route both call `notifyStatusChange`) · `userService` to rename |
