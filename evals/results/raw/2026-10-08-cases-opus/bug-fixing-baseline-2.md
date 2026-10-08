# bug-fixing-baseline-2

- Arm: **baseline** · Case: `bug-fixing` · Turns: 3 · Cost: $0.10013820000000001 · 20 s
- Project files (besides installed `.ai/`): `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

The bug is a race condition in `orders.js:3-6`. The route checks whether the order is paid, then charges the customer, and only marks the order paid after the charge returns. A slow charge leaves a gap of several seconds. If the customer clicks Pay again, refreshes or retries during that gap, the second request still sees the order as unpaid and charges the card a second time.

```js
const order = await db.orders.find(req.params.id);
if (order.status === 'paid') return ...;              // both requests pass this check
const charge = await payments.charge(...);            // slow, so both requests charge
await db.orders.update(order.id, { status: 'paid' }); // too late
```

I couldn't edit the file because I don't have a file-writing tool in this session. Here is the fix to paste in:

```js
// orders.js
app.post('/orders/:id/pay', async (req, res) => {
  // Atomically claim the order: only one request can move it out of 'pending'.
  const claimed = await db.orders.updateWhere(
    { id: req.params.id, status: 'pending' },
    { status: 'processing' }
  );
  if (!claimed) return res.status(409).send('Already paid or payment in progress');

  const order = await db.orders.find(req.params.id);
  try {
    // Idempotency key: the provider returns the original charge on retries instead of charging again.
    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
    res.send({ ok: true });
  } catch (err) {
    await db.orders.update(order.id, { status: 'pending' }); // release so the customer can retry
    throw err;
  }
});
```

There are two separate protections:
1. **Atomic claim:** the status check and the status change now happen in one database operation, so there's no gap for a second request to slip through. Concurrent requests get a 409 instead of a second charge.
2. **Idempotency key:** if a request does reach the payment provider twice (for example, after a network retry or a crash between the charge and the database update), the provider recognises the key and doesn't charge again. Most providers support this, including Stripe's `idempotencyKey` option.

**Things to check before shipping**, because I can only see this one file:
- **`db.orders.updateWhere` is a placeholder.** Use your database's conditional update and check how many rows it changed. For example, in SQL: `UPDATE orders SET status='processing' WHERE id=$1 AND status='pending'`, then check `rowCount === 1`. In Mongo, use `findOneAndUpdate` with the status in the filter.
- **The status names are assumed.** I've assumed unpaid orders have the status `'pending'`; use whatever your schema calls them. Orders can also get stuck in `'processing'` if the server crashes mid-charge, so add a cleanup job or a timeout for those.
- **Check how your payments client takes an idempotency key**; the option name may differ from `idempotencyKey`.
- **Optional:** disable the Pay button after the first click. That makes the problem less likely, but only the server-side fix actually prevents double charges.

None of this has been run or tested.
