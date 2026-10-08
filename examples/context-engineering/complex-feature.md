# Complex feature — stepwise escalation, each step earned

> **Status: PROPOSED.** Fictional.

**Request:** "Customers can pause their subscription for up to 3 months." **Budget:** large.

| Level | Added | Trigger |
|---|---|---|
| 1 | Billing scenarios in `features/billing/`, skills `payments-subscriptions`, `gherkin-specifications` | start — behavior anchor |
| 2 | `src/billing/subscriptions.ts`, its tests | the change surface |
| 3 | `src/billing/webhooks.ts`, the `subscriptions` table schema | *unknown dependency* — status changes arrive by webhook; pausing must survive them |
| 3 | `src/access/entitlements.ts` | *cross-module dependency* — paused customers must lose premium access |
| 4 | The notification and invoicing modules (their public functions only) | *conflicting implementation* — invoicing computes period ends independently of billing |
| 5 | The payment provider's official docs for the **installed** SDK version: pause/resume API | *version-specific behavior* — the pause API differs between SDK majors |

**Not loaded at any point:** mobile app code, admin dashboard UI, auth, unrelated features.

At Level 4 the agent found the conflict *because* it escalated on evidence: two modules computing period ends. Reading the whole repository up front would have included it too — buried among hundreds of files nobody needed.
