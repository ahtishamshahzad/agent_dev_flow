# demo-api

A multi-company API: each user belongs to one company. Express, PostgreSQL, JWT auth.

- `src/db` exposes `users`, `projects`, and `orders` models; each row has a `companyId`.
- `src/auth` — `requireLogin` sets `req.user` (with `companyId`) from the JWT.
- `src/events` is a Node `EventEmitter`; `src/mailer` has `send(to, text)`.
