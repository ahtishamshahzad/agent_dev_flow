# context-efficiency-baseline-1

- Arm: **baseline** · Case: `context-efficiency` · Turns: 4 · Cost: $0.096491 · 14 s
- Project files (besides installed `.ai/`): `README.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

The shipping email gets sent twice for every order, from two separate places:

1. **Through the event.** `src/orders/routes.js:9` emits `order.shipped`. `src/app.js:7` loads `src/notifications/subscribers.js`, which listens for that event and calls `sendShippedEmail(order)` (`subscribers.js:4`).
2. **Directly.** The next line, `src/orders/routes.js:10`, also calls `await sendShippedEmail(order)` itself.

So each call to `POST /orders/:id/ship` sends one email from the listener and one from the route.

**Fix:** keep the event and remove the direct call from the route. That way notifications stay in the notifications module, and anything else listening for `order.shipped` keeps working. In `src/orders/routes.js`:
- delete line 10: `await sendShippedEmail(order);`
- delete the import on line 4, which is no longer used.

**Side effect to check:** the `await` on line 10 currently makes the request fail if sending the email fails. The listener's call isn't awaited, so once the direct call is gone, an email failure won't fail the request. It becomes an unhandled promise rejection instead. If you want those failures logged, add a `.catch(...)` in `subscribers.js:4`. Shipping will still succeed even when the email doesn't send, which is usually what you want.

I haven't changed any files.
