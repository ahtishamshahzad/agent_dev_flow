# bug-fixing-agentflow-2

- Arm: **agentflow** · Case: `bug-fixing` · Turns: 7 · Cost: $0.07912459999999999 · 23 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`, `orders.js`

## Prompt

Bug: Customers sometimes get charged twice. It seems to happen when the payment page is slow. Can you fix it? The payment route is in orders.js.

## Final response

I found the root cause but haven't changed `orders.js`. The project's bugfix workflow requires an approved regression scenario before any fix, so I need your sign-off first.

**Root cause (`orders.js:3-6`)**
The handler checks `status === 'paid'`, then awaits `payments.charge(...)`, and only afterwards writes `paid`. A slow payment leaves a window of seconds during which the order still reads as unpaid. A second request in that window passes the check and charges again. The second request can come from a double-click, a browser retry or a client timeout-and-retry.

**Proposed regression scenario (Gherkin)**
```gherkin
Scenario: Concurrent payment requests charge the customer once
  Given an unpaid order "o1" and a slow payment provider
  When two pay requests for "o1" arrive at the same time
  Then the customer is charged exactly once
  And one request returns 200 and the other returns 409
  And the order is "paid" with a single chargeId
```

**Proposed fix**
1. Atomically claim the order before charging, e.g. `db.orders.updateWhere({ id, status: 'unpaid' }, { status: 'processing' })`. If no row is updated, return 409. This closes the race.
2. Pass an idempotency key to the provider, e.g. `payments.charge(customerId, total, { idempotencyKey: order.id })`. This protects against retries and a crash between charging and saving.
3. If the charge throws, revert the status to `unpaid` so the customer can retry.

**Questions before I implement**
- Does `db.orders` have an atomic conditional update (compare-and-set or a transaction)? The `updateWhere` above is a placeholder. I can't see the DB layer, since only `orders.js` is in this directory.
- Does your payments provider support idempotency keys? Stripe does, for example.
- Are the order statuses exactly `unpaid` and `paid`, and is adding `processing` acceptable?

Do you approve the scenario and the approach? If so, answer those questions and I'll implement it and add a test.
