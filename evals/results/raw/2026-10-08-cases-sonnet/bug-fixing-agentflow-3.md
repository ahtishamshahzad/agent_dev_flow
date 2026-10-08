# bug-fixing-agentflow-3

- Arm: **agentflow** · Case: `bug-fixing` · Turns: 9 · Cost: $0.12333700000000002 · 31 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`, `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I couldn't change `orders.js`. Write is disabled in this session and I have no other edit tool, so the double-charge bug is still there.

**Cause:** the route in `orders.js` checks `order.status === 'paid'` and only sets `paid` after `payments.charge()` returns. When the payment page is slow, the customer retries or double-clicks. The second request reads the order while it's still unpaid and charges again.

**Fix (not applied):** replace the contents of `orders.js` with this:

```js
// orders.js
const inFlightPayments = new Set();

app.post('/orders/:id/pay', async (req, res) => {
  const orderId = req.params.id;

  // Claim the order synchronously, before any await, so a retry that arrives
  // while the first request is still charging is rejected.
  if (inFlightPayments.has(orderId)) return res.status(409).send('Payment in progress');
  inFlightPayments.add(orderId);

  try {
    const order = await db.orders.find(orderId);
    if (order.status === 'paid') return res.status(409).send('Already paid');
    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
    res.send({ ok: true });
  } finally {
    inFlightPayments.delete(orderId);
  }
});
```

**Caveats:**
- **Single process only:** the in-memory `Set` stops duplicates within one server process. With several instances or workers, two requests can still land on different ones.
- **Assumed API:** the `idempotencyKey` option on `payments.charge` is my assumption, since the payments client isn't in this repo. If your provider supports idempotency keys (Stripe does), this is the real multi-instance protection. If it doesn't, an atomic conditional update in the database (for example, set `status` to `paying` only if it is currently `unpaid`) would be needed instead.
- **Untested:** I haven't run anything, and the repo has no tests.
- **Project rules:** the repo's `.ai/` rules ask for a regression Gherkin scenario for bug fixes, such as "second pay request while the first is in flight is rejected and the customer is charged once". I haven't written one.

If you re-enable Write or edits, I can apply the change and add the scenario. You can also paste the code in yourself.
