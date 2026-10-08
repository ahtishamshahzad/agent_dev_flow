# bug-fixing-agentflow-1

- Arm: **agentflow** · Case: `bug-fixing` · Turns: 10 · Cost: $0.1485184 · 29 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`, `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I couldn't apply the fix: the Write tool is disabled in this session, so `orders.js` is unchanged. I also haven't run or tested anything. I read `orders.js` and the project's bug-fix rules, which require a regression scenario and test.

**Root cause (`orders.js:3-6`):** the route checks `order.status === 'paid'`, then awaits the charge, then writes `paid`. When the page is slow, a double-click or a client retry sends a second request. It reads the order while it's still unpaid, so both requests call `payments.charge`.

**Proposed fix**, replacing the route:

```js
const inFlightPayments = new Set();

app.post('/orders/:id/pay', async (req, res) => {
  const orderId = req.params.id;
  if (inFlightPayments.has(orderId)) return res.status(409).send('Payment in progress');
  inFlightPayments.add(orderId);
  try {
    const order = await db.orders.find(orderId);
    if (order.status === 'paid') return res.status(409).send('Already paid');
    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}-pay`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
    res.send({ ok: true });
  } finally {
    inFlightPayments.delete(orderId);
  }
});
```

- **In-flight guard:** it only protects a single server process.
- **Idempotency key:** this covers multiple instances and retries, but only if `payments.charge` accepts an options argument and passes the key to the provider. I couldn't see that code, so I don't know that it does.
- **Stronger option:** an atomic database claim, such as a conditional update from `unpaid` to `paying`, would be more robust. I don't know your `db` API, so I didn't invent one.

The project rules also want a Gherkin scenario in `features/billing/order-payment.feature`. It would say that two rapid submissions on a slow provider charge once, return a conflict on the second, and leave the order paid. They also want a regression test that fails before the fix and passes after. There's no test framework in the repo, and choosing one is a stack decision for you, so I didn't add one.

If you re-enable writes, I'll apply the fix and add the feature file. Tell me whether `payments.charge` supports idempotency keys and what your `db` offers for atomic updates, and I'll switch to the stronger approach.
