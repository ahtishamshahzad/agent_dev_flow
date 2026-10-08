# bug-fixing-agentflow-2

- Arm: **agentflow** · Case: `bug-fixing` · Turns: 12 · Cost: $0.2432766 · 39 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`, `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I found the cause. I couldn't apply the fix, because this session has no file-editing or shell tools (only read and search). So I haven't changed anything or run any tests.

## Why customers get charged twice

The route at `orders.js:2-8` checks whether the order is paid and only updates it after the charge finishes:

```js
const order = await db.orders.find(req.params.id);                     // 1. read
if (order.status === 'paid') return res.status(409).send('Already paid'); // 2. check
const charge = await payments.charge(order.customerId, order.total);    // 3. charge (slow)
await db.orders.update(order.id, { status: 'paid', chargeId: charge.id }); // 4. mark paid
```

The order isn't marked `paid` until step 4, which happens after the slow call to the payment provider. While that call is running, a second request for the same order still sees it as unpaid and charges again. A slow page makes this likely: people double-click, refresh, or their browser or a proxy retries the request. That's why it shows up when the page is slow.

The check in step 2 only blocks a second payment after the first one has completely finished.

## Proposed fix (small, only touches this route)

1. **Claim the order in a single database step before charging.** Change its status from `pending` to `processing` only if it's still `pending`. Only one request can win; the others get a 409 and never reach the payment provider.
2. **Send an idempotency key with the charge**, e.g. `order-<id>`. This stops duplicates even if two requests somehow get through. Stripe, Adyen, Braintree and most other providers support this.
3. **If the charge fails, set the order back to `pending`** so the customer can try again.

```js
app.post('/orders/:id/pay', async (req, res) => {
  const claimed = await db.orders.updateWhere(
    { id: req.params.id, status: 'pending' },
    { status: 'processing' }
  ); // must be a single atomic conditional update
  if (!claimed) return res.status(409).send('Already paid or in progress');

  const order = await db.orders.find(req.params.id);
  let charge;
  try {
    charge = await payments.charge(order.customerId, order.total, {
      idempotencyKey: `order-${order.id}`,
    });
  } catch (err) {
    await db.orders.update(order.id, { status: 'pending' });
    throw err;
  }
  await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
  res.send({ ok: true });
});
```

`updateWhere` and `idempotencyKey` are placeholders. The repo only contains `orders.js`; it doesn't define `db` or `payments`, and there's no `package.json` or tests, so I can't tell which database or payment libraries you use.

## Regression test

The project rules require a test that fails before the fix and passes after:

```gherkin
@regression @bug-001
Scenario: Paying the same order twice at once charges the customer only once
  Given an unpaid order
  And the payment provider responds slowly
  When two pay requests for that order arrive at the same time
  Then the customer is charged exactly once
  And one request succeeds and the other is rejected with 409
```

This would be an API-level test with a fake `payments.charge` that waits before resolving and counts how many times it's called. On the current code the count is 2.

## To finish this I need

1. **Your database and payment libraries**, so the claim step is a real single-step update (for example `UPDATE … WHERE status='pending'` in SQL, or `findOneAndUpdate` in Mongo) and I use the provider's real idempotency option.
2. **Approval of the scenario above.** It changes what a duplicate request gets: an immediate 409 instead of a second charge.
3. **Write access**, or you apply the patch yourself. Then I'd also add the bug record `.ai/work-items/bugs/BUG-001.md`, the feature file under `features/payments/`, and the test.

Customers who were already charged twice will need refunds; you can find them by checking the payment provider for multiple charges on the same order. I won't take any action on that without you asking.
