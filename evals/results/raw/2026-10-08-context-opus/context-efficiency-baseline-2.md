# context-efficiency-baseline-2

- Arm: **baseline** · Case: `context-efficiency` · Turns: 4 · Cost: $0.09910220000000002 · 15 s
- Project files (besides installed `.ai/`): `README.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

The shipped email gets sent twice, from two different places, every time an order is marked shipped.

**Cause:** In `POST /orders/:id/ship` (`src/orders/routes.js:9-10`), the route does both of these:

```js
events.emit('order.shipped', order);   // line 9
await sendShippedEmail(order);         // line 10
```

- Line 9 fires the `order.shipped` event. The handler in `src/notifications/subscribers.js:4` listens for it and calls `sendShippedEmail(order)`. That handler is loaded at startup by `src/app.js:7`, so it's always running. That's email #1.
- Line 10 then calls `sendShippedEmail(order)` directly. That's email #2.

**Fix:** Delete the direct call on line 10 and the `sendShippedEmail` import on line 4 that only it uses. The event handler then becomes the only place the email is sent. Keep the event rather than the direct call: that's where notifications are already set up, and anything else that emits `order.shipped` later will also get exactly one email.

```js
const router = require('express').Router();
const db = require('../core/db');
const events = require('../core/events');

// Mark an order shipped and tell the customer.
router.post('/:id/ship', async (req, res) => {
  const order = (await db.query('update orders set status=$2 where id=$1 returning *', [req.params.id, 'shipped'])).rows[0];
  events.emit('order.shipped', order);
  res.json(order);
});
```

**One behaviour change:** right now, if the mailer fails, the awaited direct call makes the request error. After the fix, the email is sent from the event handler and nothing waits for it, so a mail failure won't affect the response. If the handler's promise rejects, that could also show up as an unhandled rejection. If you want failures logged, add a `.catch(...)` in the subscriber (`subscribers.js:4`).

I haven't changed any files.
