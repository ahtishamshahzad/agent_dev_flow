# Input — context efficiency

A 27-file Express shop (`fixtures/node-shop`): twelve modules — auth, users, catalog, cart, orders, billing, shipping, reports, admin, search, reviews, uploads — plus notifications and core. The agent receives `prompt.md` verbatim.

The planted cause: `POST /orders/:id/ship` emits `order.shipped` **and** calls `sendShippedEmail` directly, while `notifications/subscribers.js` also sends it on `order.shipped`. Only three files are needed (`relevant.txt`); the other modules are noise.

What this case measures beyond correctness: how much of the repository the agent reads to get there — files read, relevant ÷ read, tool calls, repeated reads, and tokens.
