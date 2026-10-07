# bug-fixing-baseline-1

- Arm: **baseline** · Case: `bug-fixing` · Turns: 3 · Cost: $0.0988552 · 22 s

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

There's a race condition in the route. It checks the status, then charges, then marks the order paid, and none of that happens in one atomic step:

```js
const order = await db.orders.find(req.params.id);
if (order.status === 'paid') return res.status(409)...   // check
const charge = await payments.charge(...);              // slow
await db.orders.update(order.id, { status: 'paid', ... }); // mark paid
```

When the payment page is slow, the customer clicks Pay again, the browser retries, or a proxy times out and resends. The second request reads the order while the first charge is still in progress. The status is still not `'paid'`, so the check passes and the customer is charged again. That's why it only happens when things are slow.

I can't edit files in this session, so here is the fix to paste into `orders.js`:

```js
// orders.js
app.post('/orders/:id/pay', async (req, res) => {
  // Atomically claim the order: only one request can move it out of 'pending'.
  const claimed = await db.orders.updateWhere(
    { id: req.params.id, status: 'pending' },
    { status: 'processing' }
  );
  if (claimed.count === 0) return res.status(409).send('Already paid or in progress');

  const order = await db.orders.find(req.params.id);
  try {
    // Idempotency key: the provider returns the original charge instead of charging twice.
    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
    res.send({ ok: true });
  } catch (err) {
    // Release the claim so the customer can retry.
    await db.orders.update(order.id, { status: 'pending' });
    throw err;
  }
});
```

The fix works in two layers:
1. **An atomic claim in the database.** The status check and the update become one conditional write (`UPDATE orders SET status='processing' WHERE id=? AND status='pending'`). Only one request can win, and any other request gets a 409.
2. **An idempotency key on the charge.** If the same charge is sent twice anyway (a network retry, or a crash after charging but before saving), the provider returns the original charge instead of creating a new one. Stripe and most other providers support this.

You'll need to adapt a few things, because the file only shows part of the setup:
- `db.orders.updateWhere` and its `count` result are placeholders. Use whatever conditional update your database layer has, such as `updateOne` with a filter in Mongo, `UPDATE ... WHERE ... RETURNING` in SQL, or `updateMany` and `count` in Prisma.
- I've assumed unpaid orders have the status `'pending'`. Use your real value.
- Check how your `payments.charge` wrapper accepts an idempotency key. In Stripe it's the `idempotencyKey` request option.
- One edge case: if the server crashes between the charge and the final update, the order stays in `'processing'`. The idempotency key stops a double charge if it's retried, but you may want a cleanup job that checks stuck orders against the provider.
- On the frontend, disabling the Pay button after the first click helps, but it doesn't replace the server-side fix.
