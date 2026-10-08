# bug-fixing-agentflow-1

- Arm: **agentflow** · Case: `bug-fixing` · Turns: 14 · Cost: $0.30769599999999997 · 46 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`, `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I didn't change any code yet. I found the cause, but the safe fix depends on your database and payment provider, and it changes what a customer sees on a double-click. I'd like your answers to the questions at the end first.

## What's going wrong
`orders.js:2-8` checks the order and then charges, as separate steps that nothing locks together:

```
Request A: find → status 'pending' → charge (slow…)
Request B: find → status still 'pending' → charge   ← second charge
Request A:                                  → update to 'paid'
```

The check at line 4 only stops a second request if the first one has already reached line 6. While `payments.charge` is waiting, the order still looks unpaid, so a double-click, a browser retry or a refresh charges the card again. The slower the payment page, the longer that window stays open, which is why it shows up when the page is slow.

There's a second way it can happen: if the charge succeeds but the update at line 6 fails or times out, the order stays unpaid and the next retry charges again.

## Proposed fix (two layers, both needed)
1. **Only one request can start a payment.** Instead of "read, then check", do a single conditional update that moves the order from `pending` to `paying` and only succeeds if it's still `pending`. Any other request at the same time gets a 409.
2. **Tell the payment provider this is one payment.** Send an idempotency key such as `order-<id>` with the charge, so a repeated request returns the original charge instead of making a new one. This covers the "charge succeeded, update failed" case.

```js
app.post('/orders/:id/pay', async (req, res) => {
  // Atomically claim the order so only one request can charge it.
  const claimed = await db.orders.updateWhere(
    { id: req.params.id, status: 'pending' },
    { status: 'paying' }
  );
  if (!claimed) return res.status(409).send('Already paid or payment in progress');
  const order = await db.orders.find(req.params.id);
  try {
    const charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}`,
    });
    await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
    res.send({ ok: true });
  } catch (err) {
    // Safe to release because a retry reuses the same idempotency key.
    await db.orders.update(order.id, { status: 'pending' });
    throw err;
  }
});
```

`updateWhere` and the `idempotencyKey` option are placeholders. I can't confirm either exists, because the repo has only `orders.js`, with `db` and `payments` used as globals and no `package.json` or tests (I searched the repo root, `src/`, `test(s)/` and `features/`).

## Test that should fail now and pass after the fix
```gherkin
@regression @bug-001 @payment @critical
Scenario: Two pay requests at the same time charge the customer once
  Given a pending order with total 50.00
  And the payment provider takes 2 seconds to respond
  When two pay requests for that order are sent at the same time
  Then the customer is charged exactly once
  And one request succeeds and the other gets 409
  And the order is "paid" with a single chargeId
```

## What I need from you
1. **Database:** which one, and does the data layer support a conditional update (e.g. `UPDATE … WHERE status='pending'` returning the affected row count, or `findOneAndUpdate`)?
2. **Payment provider:** which one, and does it accept idempotency keys?
3. **Behavior change:** a second click during payment will now get 409 "payment in progress". Is that fine, or should it wait and return the first request's result? Note the code assumes unpaid orders have status `pending`. If unpaid orders use a different status value, tell me what it is.
4. **Testing:** there's no test setup in the repo. Should I add one (which framework?), or is there a test suite somewhere else?
5. **Tracking:** can I record this as `BUG-001` and add the scenario under `features/payments/`?

Once you answer, I'll adapt the fix to your real APIs, write the test first and confirm it fails on the current code, then apply the fix.
