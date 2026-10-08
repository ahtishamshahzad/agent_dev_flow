# context-efficiency-agentflow-3

- Arm: **agentflow** · Case: `context-efficiency` · Turns: 6 · Cost: $0.120922 · 39 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

The ship route sends the shipped email twice: once by emitting an event that already sends the email, and again by calling the email function directly.

**Cause:** in `src/orders/routes.js:9-10`, the ship handler does both of these:

```js
events.emit('order.shipped', order);   // line 9
await sendShippedEmail(order);         // line 10
```

`src/notifications/subscribers.js:4` already listens for that event and sends the email:

```js
events.on('order.shipped', (order) => sendShippedEmail(order));
```

The comment at `subscribers.js:3` says "Customer emails are sent from domain events," so the event listener is meant to send the email. The direct call in the route is the extra one. Nothing else emits `order.shipped` or calls `sendShippedEmail`, so this is the only cause.

**Fix:** in `src/orders/routes.js`, delete line 10 (`await sendShippedEmail(order);`) and the import on line 4 that it uses. Keep the `events.emit`. That matches how `order.paid` → `sendReceipt` already works.

Some things to consider alongside the fix:
- **Errors:** the listener doesn't wait for the email, so a mailer failure will no longer fail the HTTP request. If you want those failures to be visible, add error handling or logging to the listener.
- **Missing order:** if the `id` doesn't exist, `order` is `undefined`, but the route still emits the event. The route should return 404 before emitting. This is a separate bug, but it's next to the fix.
- **Process rule:** this repo's rules ask for an approved Gherkin scenario before a change in behaviour. For example: *"Given an order, when it is marked shipped, then the customer receives exactly one shipped email."* Approve that (or edit it) and I'll make the change and add a test for it.
