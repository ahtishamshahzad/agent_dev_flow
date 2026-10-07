# duplicate-notifications-agentflow-1

- Arm: **agentflow** · Case: `duplicate-notifications` · Turns: 17 · Cost: $0.354385 · 44 s

## Prompt

Users are receiving duplicate notifications when their order status changes. Please fix it.

## Final response

I couldn't apply the fix: this session only has read and search tools, with no Edit, Write or Bash. I've found the root cause, and below is the exact change, regression scenario and test ready to apply. Nothing has been changed or run.

## Root cause

A status change sends the email twice, through two separate paths:

- **`src/app.js:27-28`** — the PATCH route emits `order.statusChanged`, then also calls `notifyStatusChange(order)` directly.
- **`src/notifications/sendOnStatusChange.js:9`** — the module subscribes to `order.statusChanged` and calls `notifyStatusChange` itself. `app.js` loads this module, so the listener is always active.

The result is one email from the event listener and a second from the direct call, every time.

## Proposed fix (one line)

Remove the direct call and keep the event as the only way notifications are sent. That's what the comment in `sendOnStatusChange.js` says the design is, and it means anything else that emits the event later also notifies the customer, exactly once.

```diff
 // src/app.js
 app.patch('/orders/:id/status', requireLogin, async (req, res) => {
   const order = await db.orders.update(req.params.id, { status: req.body.status });
   events.emit('order.statusChanged', order);
-  await notifyStatusChange(order);
   res.json(order);
 });
```

Also delete the now-unused import on line 5 (`const { notifyStatusChange } = require(...)`), but replace it with `require('./notifications/sendOnStatusChange');` so the listener is still registered.

## Regression scenario (`features/orders/status-notifications.feature`)

```gherkin
@regression @bug-001
Feature: Order status notifications
  Scenario: Customer gets exactly one notification per status change
    Given a logged-in user and an order for "customer@example.com"
    When the order's status is changed to "shipped"
    Then exactly one notification is sent to "customer@example.com"
    And it says the order is now "shipped"
```

## Regression test (`test/orderStatusNotification.test.js`, runs with `npm test`)

```js
const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const { EventEmitter } = require('node:events');

const src = (p) => require.resolve(path.join(__dirname, '../src', p));
const stub = (p, exports) => { require.cache[src(p)] = { id: src(p), filename: src(p), loaded: true, exports }; };

test('@bug-001 one notification per order status change', async () => {
  const sent = [];
  stub('mailer', { send: async (to, msg) => sent.push({ to, msg }) });
  stub('events', new EventEmitter());
  stub('auth', { requireLogin: (req, res, next) => { req.user = { companyId: 1 }; next(); } });
  stub('db', { orders: { update: async (id, { status }) => ({ id, status, customerEmail: 'customer@example.com' }) } });
  stub('services/userService', {});

  const app = require('../src/app');
  const server = app.listen(0);
  const { port } = server.address();
  await fetch(`http://localhost:${port}/orders/42/status`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'shipped' }),
  });
  server.close();

  assert.strictEqual(sent.length, 1);
  assert.match(sent[0].msg, /order 42 is now shipped/);
});
```

On the current code this test should fail with 2 emails sent, and pass after the fix. I haven't run it either way, so treat that as unverified. Two things could stop it running:
- `src/db`, `src/mailer`, `src/events` and `src/auth` aren't in the repo (the test replaces them with stubs).
- I couldn't check whether `express` is installed.

## Workflow records (per `.ai/workflows/bugfix.md`)
- Classified as a **bug**. The expected behavior (one email per change) isn't disputed, so the full planning gates don't apply.
- Still to create: `.ai/work-items/bugs/BUG-001.md` with the root cause above, and the scenario file under `features/`.

## Separate issue (not part of this fix)
The event listener doesn't catch errors from the mailer. If sending fails, the promise rejection goes unhandled and can crash Node. It should get its own work item.

If you enable editing and Bash, I'll apply the fix, add the scenario, test and bug record, and run the test against the old and new code.
