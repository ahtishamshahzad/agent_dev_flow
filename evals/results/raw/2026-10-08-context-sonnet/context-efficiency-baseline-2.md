# context-efficiency-baseline-2

- Arm: **baseline** · Case: `context-efficiency` · Turns: 6 · Cost: $0.0541186 · 16 s
- Project files (besides installed `.ai/`): `README.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

**Cause:** The ship endpoint sends the shipped email twice. In `src/orders/routes.js`, the `POST /:id/ship` handler does both of these:

- Line 9, `events.emit('order.shipped', order)`. The listener in `src/notifications/subscribers.js:4` handles this event and calls `sendShippedEmail(order)`. `src/app.js:7` loads that file, so the listener is registered.
- Line 10, `await sendShippedEmail(order)`. This calls the same function directly.

Each ship request therefore sends two emails.

**Fix:** Delete line 10 of `src/orders/routes.js`, the direct `await sendShippedEmail(order);` call. Also delete the now-unused import on line 4. The `order.shipped` event and its subscriber then send the one email. This matches how `order.paid` already works, where the email goes out through the subscriber only.

I'd remove the direct call instead of the event. The subscriber is the established pattern for customer emails, and other listeners may rely on the event.

One side effect: the direct call was awaited, so a mailer failure used to make the request fail. The listener is not awaited, so a failure there would be an unhandled rejection. You may want a `.catch` with logging on the subscriber's `sendShippedEmail` call. I haven't checked whether anything else emits `order.shipped`, for example in `src/shipping/`. I can check that if you want.

I haven't changed any files.
