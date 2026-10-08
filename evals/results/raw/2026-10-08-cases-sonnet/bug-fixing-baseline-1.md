# bug-fixing-baseline-1

- Arm: **baseline** · Case: `bug-fixing` · Turns: 4 · Cost: $0.060417799999999994 · 15 s
- Project files (besides installed `.ai/`): `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I couldn't change `orders.js`. The file-writing tools are disabled in this session, so nothing has been edited. Below are the cause and the fix to apply.

**Cause:** The route checks `order.status`, then charges, then marks the order paid. These steps aren't atomic. If the page is slow, the customer clicks again or the client retries. The second request reads the order while it's still unpaid, because the first request hasn't reached `db.orders.update`. Both then call `payments.charge`.

**Fix:** Two guards, in this order of importance:
1. **Idempotency key on the charge.** The payment provider returns the same charge for repeated calls with the same key. This also works across multiple server instances.
2. **In-flight guard.** It rejects a second request for the same order while the first is still running. It only protects a single process.

```js
// orders.js
const inFlight = new Set();

app.post('/orders/:id/pay', async (req, res) => {
  const orderId = req.params.id;

  if (inFlight.has(orderId)) return res.status(409).send('Payment in progress');
  inFlight.add(orderId);

  try {
    const order = await db.orders.find(orderId);
    if (order.status === 'paid') return res.status(409).send('Already paid');

    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
    res.send({ ok: true });
  } finally {
    inFlight.delete(orderId);
  }
});
```

**Caveats:**
- I don't know your `payments.charge` signature. Check how your provider takes an idempotency key (Stripe, for example, uses a request option or header) and adjust the third argument to match.
- If you run more than one server instance, the in-flight set won't help. The idempotency key is what protects you there. A conditional DB update such as `UPDATE ... SET status='paying' WHERE status='unpaid'` would also work.

If you enable edits, I can apply this directly.
