# Fixtures

Starting code copied into each run's fresh temp project. **The gaps are deliberate** — this note stays outside the copied folder so the agent isn't told.

| Fixture | Planted for |
|---|---|
| `node-api/` | `GET /users` has no pagination · `GET /projects/:id` has no company check (cross-tenant read) · a status change emails the customer twice (the event listener and the route both call `notifyStatusChange`) · `userService` to rename |
