# context-efficiency-agentflow-1

- Arm: **agentflow** · Case: `context-efficiency` · Turns: 5 · Cost: $0.05734299999999999 · 15 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

**Cause:** The ship route sends the shipped email twice, through two separate paths.

- `src/orders/routes.js:9` emits `order.shipped`. The subscriber in `src/notifications/subscribers.js:4` handles that event by calling `sendShippedEmail(order)`. That's the first email.
- `src/orders/routes.js:10` then calls `sendShippedEmail(order)` directly. That's the second email.

**Fix:** Delete line 10 (`await sendShippedEmail(order);`) from `src/orders/routes.js`. Also remove the now-unused import on line 4. The subscriber is the established mechanism: `order.paid` receipts already work this way, and the comment in `subscribers.js` says customer emails are sent from domain events.

**Caveats:**
- The subscriber isn't awaited, so the response no longer waits for the email, and a mail failure won't surface in the request. That's usually what you want. If you need the failure to be visible, handle it inside the subscriber with a `.catch` and logging.
- I haven't confirmed that `subscribers.js` is loaded at app startup. If it isn't, removing line 10 would stop the shipped email entirely. Check that something requires it before making the change.
- I only looked at these three files. I didn't check for other `order.shipped` listeners or other places that call `sendShippedEmail`.

I haven't changed any files. Do you want me to make the edit?
