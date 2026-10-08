# Simple bug — Level 2 is enough

> **Status: PROPOSED.** Fictional.

**Request:** "Customers get the order-status email twice."

**Budget:** small.

| Step | Loaded | Why |
|---|---|---|
| 1 | `CURRENT_STATUS.md`, operating rules (global) | always |
| 2 | `agentflow context suggest "duplicate email order status"` | starting set to verify |
| 3 | `features/orders/status-notifications.feature` — "Customer gets one email per status change" | behavior anchor; the regression scenario already exists |
| 4 | `src/notifications/sendOnStatusChange.js` (12 lines) | top file; path matches "status" |
| 5 | `src/routes/orders.js`, lines 20–32 only | the scenario's `When` is a status change — that's where it happens |
| 6 | `test/orders.test.js` | the direct test to extend |

**Found:** the route calls `notify()` and also emits the event the listener handles.

**Not loaded:** the mailer, the database layer, auth, billing, any other feature file, and every skill but `bug-investigation`. No trigger pointed there — the cause was visible at Level 2.

**Stopped because:** the change (remove the direct call), its test (one email per change), and the risk (nothing else calls `notify()` — one search) were all stated with nothing unexplained.
