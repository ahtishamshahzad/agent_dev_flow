# bug-fixing-baseline-3

- Arm: **baseline** · Case: `bug-fixing` · Turns: 4 · Cost: $0.0623888 · 21 s
- Project files (besides installed `.ai/`): `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I couldn't edit `orders.js`. File writing is disabled in this session, so the file is unchanged. Here is the diagnosis and the fix to apply.

**Cause:** the route checks `status === 'paid'`, then charges, then marks the order paid. Those three steps aren't atomic. If the page is slow, the customer clicks again or the client retries. The second request reads the order while it's still unpaid, because the first request hasn't reached the update yet. Both requests then call `payments.charge`.

**Fix:** claim the order atomically before charging, and send an idempotency key to the payment provider as a second safeguard.

```js
// orders.js
app.post('/orders/:id/pay', async (req, res) => {
  const order = await db.orders.find(req.params.id);
  if (!order) return res.status(404).send('Not found');
  if (order.status === 'paid') return res.status(409).send('Already paid');

  // Atomically claim the order so concurrent/retried requests can't both charge.
  const claimed = await db.orders.updateIf(
    order.id,
    { status: order.status },
    { status: 'processing' }
  );
  if (!claimed) return res.status(409).send('Payment already in progress');

  try {
    // Idempotency key makes a retried charge for the same order a no-op at the provider.
    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
    res.send({ ok: true });
  } catch (err) {
    // Release the claim so the customer can retry after a failed charge.
    await db.orders.update(order.id, { status: order.status });
    throw err;
  }
});
```

**Assumptions:** I only had this one file, so two things in the fix are guesses about your code.
- `db.orders.updateIf(id, where, changes)` is a placeholder for a conditional update that returns whether a row changed. In SQL that's `UPDATE orders SET status='processing' WHERE id=? AND status=?`, checking the affected row count. Swap in whatever your DB layer offers.
- The `{ idempotencyKey }` option matches Stripe-style APIs. Check that your `payments.charge` supports it.

**Edge case:** if the server crashes after claiming but before the `catch` runs, the order stays in `processing`. You'll want a timeout or a reconciliation job for that.

If you re-enable writes, I can apply this directly.
