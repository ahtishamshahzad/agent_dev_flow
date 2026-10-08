# context-efficiency-baseline-3

- Arm: **baseline** · Case: `context-efficiency` · Turns: 5 · Cost: $0.10174300000000001 · 14 s
- Project files (besides installed `.ai/`): `README.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

The shipping route sends the email twice: once directly, and once through the event subscriber.

**Cause**

The handler for `POST /orders/:id/ship` in `src/orders/routes.js` does both of these:

```js
events.emit('order.shipped', order);   // line 9
await sendShippedEmail(order);         // line 10
```

`src/notifications/subscribers.js:4` is loaded at startup (`src/app.js:7`) and already listens for that event:

```js
events.on('order.shipped', (order) => sendShippedEmail(order));
```

So the `emit` on line 9 sends one email through the subscriber, and line 10 sends a second one directly.

**Fix**

Remove the direct call and leave the email to the subscriber. The comment in `subscribers.js` ("Customer emails are sent from domain events") says that's the intended design, and `order.paid` → `sendReceipt` already works that way. In `src/orders/routes.js`:
- Delete line 10: `await sendShippedEmail(order);`
- Delete the import on line 4, which nothing else in the file uses.

One side effect: the route no longer waits for the email to send. The subscriber doesn't `await` or catch anything, so if sending fails, the API call still succeeds and the error becomes an unhandled rejection. To keep that from going unnoticed, add a `.catch(...)` that logs the error in the subscriber.

No files were changed.
