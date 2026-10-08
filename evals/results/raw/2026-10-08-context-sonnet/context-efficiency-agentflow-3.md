# context-efficiency-agentflow-3

- Arm: **agentflow** · Case: `context-efficiency` · Turns: 5 · Cost: $0.056855600000000006 · 19 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

**Cause:** The shipped email is sent twice for each ship request.

1. `src/orders/routes.js:9` emits `order.shipped`. The subscriber at `src/notifications/subscribers.js:4` listens for that event and calls `sendShippedEmail(order)`. That is the first email.
2. `src/orders/routes.js:10` then calls `sendShippedEmail(order)` directly. That is the second email.

**Fix:** Delete line 10 in `src/orders/routes.js`, `await sendShippedEmail(order);`. Also delete the now-unused import on line 4.

I'd keep the event-driven path. The file's own comment says customer emails are sent from domain events, and `order.paid` already works that way for receipts.

There's a tradeoff. The subscriber doesn't `await` the send and has no error handling. After the fix, a mailer failure no longer fails the HTTP request, but it could surface as an unhandled rejection. You may want a `.catch` that logs in the subscriber.

I haven't confirmed that `subscribers.js` is loaded at app startup. If it weren't, customers would get one email, not two. Two emails suggests it is loaded. I also haven't run anything, so this comes from reading the code. I haven't changed any files.
