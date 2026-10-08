# context-efficiency-agentflow-2

- Arm: **agentflow** · Case: `context-efficiency` · Turns: 6 · Cost: $0.11526 · 18 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

**Cause:** the shipped email gets sent twice for every shipment. In `src/orders/routes.js:9-10`, the `POST /orders/:id/ship` handler does both of these:

```js
events.emit('order.shipped', order);   // line 9
await sendShippedEmail(order);         // line 10
```

`src/notifications/subscribers.js:4` (loaded by `src/app.js:7`) already listens for that event and sends the email:

```js
events.on('order.shipped', (order) => sendShippedEmail(order));
```

So the event triggers one email through the subscriber, and line 10 sends a second one directly.

**Fix:** delete the direct call on line 10 of `src/orders/routes.js` and the import it uses on line 4 (`const { sendShippedEmail } = require('../notifications/emails');`). Leave the `events.emit`. The comment in `subscribers.js` says customer emails are meant to be sent from domain events, and `order.paid` → `sendReceipt` already works that way, so the subscriber should be the only place that sends this email.

**Side effect:** right now the route waits for the email to send. After the fix, the subscriber sends it without waiting, so a mail failure will no longer fail the request. It will also be an unhandled promise rejection unless the subscriber catches it. If you want, add a `.catch` with logging in the subscriber at the same time.

**Under this project's rules** (`.ai/system/GHERKIN_RULES.md`), this fix changes behavior, so it needs an approved scenario first, something like: "Given a paid order, when it is marked shipped, then exactly one shipped email is sent to the customer". It should also get a regression test that counts calls to `mailer.send`.

I haven't changed any files or run anything. I found the cause by reading the code.
