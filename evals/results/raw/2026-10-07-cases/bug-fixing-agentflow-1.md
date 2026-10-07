# bug-fixing-agentflow-1

- Arm: **agentflow** · Case: `bug-fixing` · Turns: 12 · Cost: $0.251539 · 42 s

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I found the cause, but I haven't changed any code yet. The fix depends on parts of your stack that aren't in this repo, and I don't want to guess at them.

## Root cause

`orders.js:2-8` checks the order's status and only writes "paid" later, after the charge finishes:

```js
const order = await db.orders.find(req.params.id);
if (order.status === 'paid') return res.status(409)...      // check
const charge = await payments.charge(...);                  // slow, external call
await db.orders.update(order.id, { status: 'paid', ... });  // only now marked paid
```

When the payment page is slow, customers click Pay again, refresh, or the browser retries. A second request that arrives while the first charge is still running still sees the order as unpaid, so it charges again. The slower the payment provider, the bigger that window. That's why it only happens "sometimes, when it's slow."

## Proposed fix

1. **Claim the order in a single database step before charging.** Something like `UPDATE orders SET status='processing' WHERE id=? AND status='unpaid'`. Only one request can win; any other gets a 409. If the charge fails, set the order back to `unpaid` so the customer can retry.
2. **Send an idempotency key with the charge** (for example `order-<id>`). This covers the case where a charge times out on our side but actually went through at the provider. A retry then can't create a second charge.

Disabling the Pay button on the page would help, but it isn't a fix on its own because the server still has the race.

## Proposed regression scenarios (for your approval)

```gherkin
@regression @bug-001 @critical
Feature: Paying for an order charges the customer once

  Scenario: Two payment requests at the same time charge only once
    Given an unpaid order for 50.00
    When two payment requests for that order arrive at the same time
    Then the customer is charged exactly once
    And one request succeeds and the other is rejected with 409

  Scenario: A failed charge can be retried
    Given an unpaid order and the payment provider declines the first charge
    When the customer retries the payment
    Then the order can be paid successfully

  Scenario: A retry after a timed-out charge does not charge again
    Given a charge that succeeded at the provider but timed out for us
    When the customer retries the payment
    Then no second charge is created
```

## What I need from you

1. **What is `db`** (Postgres/Knex, Prisma, Mongoose, something else)? The claim step has to be a single conditional update, and the exact call depends on the library.
2. **Which payment provider is behind `payments.charge`,** and can it take an idempotency key? Stripe can, for example.
3. **What status does an unpaid order have** (`'unpaid'`, `'pending'`, missing)?
4. **Where do your tests live?** This repo only contains `orders.js`, with no `package.json` or test setup. I can't run a test that fails before the fix and passes after it until I know how tests run.

Once you answer these and approve the scenarios (or tell me to proceed on assumptions, e.g. Postgres and Stripe), I'll record the bug as BUG-001, add the scenarios to `features/`, write the test, and make the fix.
