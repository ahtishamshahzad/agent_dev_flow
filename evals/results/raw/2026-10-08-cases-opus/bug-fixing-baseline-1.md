# bug-fixing-baseline-1

- Arm: **baseline** · Case: `bug-fixing` · Turns: 3 · Cost: $0.10577999999999999 · 19 s
- Project files (besides installed `.ai/`): `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I found the cause, but I couldn't apply the fix. This session only gave me tools to read files, not edit them. Below is the change to paste into `orders.js`. I haven't run or tested it.

## Root cause: two requests can both pass the "already paid" check

`orders.js:3-6` reads the order, checks whether it's `paid`, charges the card, and only then marks it `paid`. When the payment provider is slow, that gap can last several seconds. If the customer clicks Pay again, refreshes, or the browser or a proxy resends the request, a second request reads the order while it's still unpaid, passes the check, and charges the card again.

```
Request A: find → status 'pending' ✓ → charge… (slow) ……………… → update 'paid'
Request B:        find → status 'pending' ✓ → charge… → update 'paid'   ← second charge
```

## Fix

There are two parts:

1. **Claim the order in one database step before charging.** Only the request that changes the status from `pending` to `paying` goes on to charge. Any other request gets a 409.
2. **Send an idempotency key to the payment provider.** If a charge times out on our side but went through at the provider, a retry with the same key won't create a second charge.

```js
// orders.js
app.post('/orders/:id/pay', async (req, res) => {
  // Atomically claim the order so only one request can proceed to charge it.
  const claimed = await db.orders.updateWhere(
    { id: req.params.id, status: 'pending' },
    { status: 'paying' }
  );
  if (!claimed) return res.status(409).send('Order already paid or payment in progress');

  const order = await db.orders.find(req.params.id);
  try {
    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}-pay`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
  } catch (err) {
    // Release the claim so the customer can retry; the idempotency key
    // prevents a double charge if the first attempt actually succeeded.
    await db.orders.update(order.id, { status: 'pending' });
    return res.status(502).send('Payment failed, please try again');
  }
  res.send({ ok: true });
});
```

## Two things to adapt to your code

- **`updateWhere`** is a placeholder. I can't see your database layer, so you'll need the equivalent single conditional update. In SQL that's `UPDATE orders SET status='paying' WHERE id=$1 AND status='pending'`, then check that the affected row count is 1. In Mongo it's `findOneAndUpdate({_id, status:'pending'}, {$set:{status:'paying'}})`. A separate read followed by a write won't work, because that's the same race again.
- **The `idempotencyKey` option** depends on your provider's SDK. Stripe accepts `{ idempotencyKey }` as a request option, and most other providers have something similar.

It's also worth disabling the Pay button after the first click, but that only helps. The server-side claim is the real fix.
