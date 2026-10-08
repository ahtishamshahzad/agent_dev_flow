# context-efficiency-agentflow-2

- Arm: **agentflow** · Case: `context-efficiency` · Turns: 4 · Cost: $0.055892399999999995 · 26 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `README.md`, `USAGE.md`, `package.json`, `src/admin/routes.js`, `src/app.js`, `src/auth/routes.js`, `src/billing/routes.js`, `src/billing/stripe.js`, `src/cart/routes.js`, `src/catalog/routes.js`, `src/core/db.js`, `src/core/events.js`, `src/core/logger.js`, `src/notifications/emails.js`, `src/notifications/mailer.js`, `src/notifications/subscribers.js`, `src/orders/routes.js`, `src/reports/routes.js`, `src/reviews/routes.js`, `src/search/routes.js`, `src/shipping/carriers.js`, `src/shipping/routes.js`, `src/uploads/routes.js`, `src/users/routes.js`, `test/auth.test.js`, `test/billing.test.js`, `test/catalog.test.js`, `test/orders.test.js`

## Prompt

Customers get two emails when their order ships. Find the cause and tell me the fix. Don't change any files yet.

## Final response

**Cause:** Two code paths each send the shipped email, and both run on every ship.

- `src/orders/routes.js:9` emits `order.shipped`. The subscriber at `src/notifications/subscribers.js:4` listens for that event and calls `sendShippedEmail(order)`.
- `src/orders/routes.js:10` then calls `sendShippedEmail(order)` directly, so the customer gets a second email.

**Fix:** Delete line 10 in `src/orders/routes.js` (`await sendShippedEmail(order);`). Also delete the now-unused import on line 4.

I'd keep the event subscriber. `order.paid` already works this way (`sendReceipt` is sent only through its subscriber), and the comment in `subscribers.js` says customer emails are sent from domain events.

**Side effects of the fix:**
- The subscriber doesn't `await` or catch errors, so a mail failure no longer reaches the HTTP response. Today it would make the request fail, and after the fix it won't. If you want failures logged, add a `.catch` in the subscriber.
- Check that `subscribers.js` is loaded at app startup. I didn't check this. If it isn't, removing line 10 would stop the emails entirely. But customers are getting two emails now, so it is probably loaded.

I haven't changed any files. Do you want me to make the edit?
