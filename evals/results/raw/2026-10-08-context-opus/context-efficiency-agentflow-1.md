# context-efficiency-agentflow-1

- Arm: **agentflow** · Case: `context-efficiency` · Turns: 5 · Cost: $0.10983299999999999 · 15 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

The shipped email is being sent twice on every shipment, once by an event subscriber and once directly by the route.

**How it happens:** in `src/orders/routes.js:7-12`, the `POST /:id/ship` handler does both of these:

```js
events.emit('order.shipped', order);   // line 9 → subscriber sends email #1
await sendShippedEmail(order);         // line 10 → sends email #2 directly
```

`src/notifications/subscribers.js:4` already listens for `order.shipped` and calls `sendShippedEmail(order)`. The comment on line 3 says customer emails are meant to come from domain events, so the direct call in the route is the extra one. The receipt email (`order.paid`) only goes through the subscriber, which is why it isn't duplicated.

**Fix:** in `src/orders/routes.js`, remove line 10 (`await sendShippedEmail(order);`) and the import on line 4 that is then unused. Keep the `events.emit`. The subscriber stays the only place that sends customer emails, matching how the receipt is handled.

**Things to check when you make the change:**
- **Return timing changes.** Today the route waits for the email before responding. After the fix it responds without waiting, and the send happens in the background. The subscriber also doesn't catch errors, so a failed send could become an unhandled promise rejection. Add a `.catch` with logging in the subscriber, or use a reliable queue if delivery matters.
- **Add a test.** Calling `POST /orders/:id/ship` once should trigger `mailer.send` exactly once.

I haven't changed any files, as you asked.
