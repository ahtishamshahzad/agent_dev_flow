# bug-fixing-baseline-2

- Arm: **baseline** · Case: `bug-fixing` · Turns: 4 · Cost: $0.0624554 · 20 s
- Project files (besides installed `.ai/`): `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I couldn't apply the fix. The Write tool is disabled in this session and I have no other way to edit files. Below is the change for `orders.js` so you can apply it.

**Cause:** the route checks `status === 'paid'`, then charges, then marks the order paid. When the page is slow, the customer clicks again or the client retries. The second request reads the order before the first one has written `paid`, so it passes the check and charges again.

**Fix:**
```js
// orders.js
app.post('/orders/:id/pay', async (req, res) => {
  const order = await db.orders.find(req.params.id);
  if (order.status === 'paid') return res.status(409).send('Already paid');

  // Atomically claim the order so concurrent/retried requests can't both charge.
  const claimed = await db.orders.updateIf(order.id, { status: order.status }, { status: 'processing' });
  if (!claimed) return res.status(409).send('Payment already in progress');

  try {
    // Idempotency key makes the provider dedupe if this call is retried.
    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
    res.send({ ok: true });
  } catch (err) {
    await db.orders.update(order.id, { status: order.status }); // release the claim
    throw err;
  }
});
```

**Assumptions to check:**
- `db.orders.updateIf(id, where, changes)` doesn't exist in what I could see. It needs to be a single atomic compare-and-set that returns whether a row changed. In SQL that's `UPDATE orders SET status='processing' WHERE id=? AND status=?` and checking the affected row count. A read followed by a write won't fix the race.
- `payments.charge` needs to accept an idempotency key. Stripe and most providers do, but the option name varies. The key stops duplicate charges even if the process crashes after charging and before the database update.
- If a crash leaves an order stuck in `processing`, you'll need a way to recover it, such as a timeout or a reconciliation job.

If you tell me your DB layer and payment provider, or enable editing, I can apply this with the real APIs.
