# context-efficiency-baseline-1

- Arm: **baseline** · Case: `context-efficiency` · Turns: 4 · Cost: $0.0510798 · 15 s
- Project files (besides installed `.ai/`): `README.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

**Cause:** The shipped email is sent twice for each shipment, by two separate code paths.

1. `src/orders/routes.js:9` emits the `order.shipped` event. The subscriber at `src/notifications/subscribers.js:4` listens for that event and calls `sendShippedEmail(order)`. That is the first email.
2. `src/orders/routes.js:10` then calls `sendShippedEmail(order)` directly. That is the second email.

The subscriber file's own comment says customer emails are meant to be sent from domain events. The direct call in the route is the leftover.

**Fix:** Delete line 10 in `src/orders/routes.js`, `await sendShippedEmail(order);`. Also remove the `sendShippedEmail` import on line 4, since nothing else in that file uses it. The event subscriber then sends the only email. This matches how `order.paid` and `sendReceipt` already work.

**Caveat:** The subscriber calls `sendShippedEmail` without awaiting it. If the mailer fails, you get an unhandled rejection, and the route no longer waits for the send. If you want failures handled, add a `.catch` that logs in the subscriber.

I haven't verified that `subscribers.js` is loaded at app startup. I only searched for the email calls. If nothing requires it, removing the direct call would stop the shipped email entirely. Check that before you make the change.

I haven't changed any files. Do you want me to make the edit?
