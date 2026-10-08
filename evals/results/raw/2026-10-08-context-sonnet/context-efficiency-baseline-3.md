# context-efficiency-baseline-3

- Arm: **baseline** · Case: `context-efficiency` · Turns: 5 · Cost: $0.052137 · 15 s
- Project files (besides installed `.ai/`): `README.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

**Cause:** The shipped email is sent twice for each shipment.

1. `src/orders/routes.js:9` emits `order.shipped`. The subscriber in `src/notifications/subscribers.js:4`, which `src/app.js:7` loads, handles that event by calling `sendShippedEmail(order)`.
2. `src/orders/routes.js:10` then calls `sendShippedEmail(order)` directly.

Every call to `POST /:id/ship` therefore sends the email once through the event and once through the direct call.

**Fix:** Delete line 10 in `src/orders/routes.js`, `await sendShippedEmail(order);`. Also delete the `sendShippedEmail` import on line 4, which is then unused. The event subscriber stays as the only sender. That matches the comment in `subscribers.js`, "Customer emails are sent from domain events", and the way `order.paid` receipts are handled.

**Tradeoff:** The subscriber is fire-and-forget, so `res.json` no longer waits for the email. A failed send will now be an unhandled rejection. You may want a `.catch` with logging in the subscriber, such as `sendShippedEmail(order).catch(log)`.

I haven't changed any files. Do you want me to make the edit?
