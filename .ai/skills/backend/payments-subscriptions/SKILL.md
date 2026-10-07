---
name: payments-subscriptions
description: Use to design one-off payments and recurring subscriptions with a payment provider — plans, seats, trials, upgrades and proration, failed payments and dunning, entitlements, refunds, and keeping your records in sync with the provider through idempotent webhooks.
---

# Payments & Subscriptions

## Purpose

Take money correctly and keep access in step with what was paid. The provider (Stripe, Paddle, Adyen, App Store / Play billing, …) is the source of truth for charges; your database is the source of truth for **entitlements** — what a customer may use — derived from provider events, never from what the client says it bought.

## When to Use

- Checkout, one-off payments, subscriptions, seat- or usage-based billing, trials, plan changes, cancellations, refunds.
- **Not** for choosing a provider in isolation (a stack decision — `../../stack-recommendation`), or for webhook mechanics in general (`webhooks`).

## Inputs

- The approved behavior scenarios for billing (`../../../system/GHERKIN_RULES.md`) — upgrade, decline, duplicate confirmation, cancellation, authorization.
- The chosen provider and its event model; pricing model (flat, per-seat, usage, tiers); tax and invoicing obligations.

## Discovery Questions

- One-off, recurring, or both? Per seat, per usage, or flat?
- Trials? Proration on upgrade and downgrade? What happens at the end of a failed-payment grace period?
- Who may manage billing (roles)? Is this B2B (invoices, tax IDs) or B2C?
- Mobile apps: are digital goods sold in-app (store billing rules apply)?

## Responsibilities

- Model **customer ↔ provider customer**, **subscription** (plan, quantity, status, period end), and **entitlements** separately.
- Drive state from **provider events**, verified and processed idempotently (`webhooks`); the redirect after checkout is a hint, never proof of payment.
- Make every money-moving call **idempotent** (provider idempotency keys) and every state transition atomic (`../../database/transactions`).
- Define the failed-payment path: retry schedule, grace period, notifications, downgrade or suspension — and what the customer sees at each step.
- Keep seat counts in sync with actual members; reconcile periodically against the provider.
- Restrict billing management to permitted roles; never trust client-sent prices, plans, or quantities.

## Required Workflow

1. Start from the approved billing scenarios; add any missing failure cases (decline, duplicate event, out-of-order event, provider down, unauthorized actor) before design.
2. Map provider events to subscription states and entitlement changes.
3. Design checkout, plan change, cancellation, and refund flows server-side.
4. Design webhook handling: signature check, dedupe by event ID, ordering by event time or object version, async processing.
5. Plan reconciliation (a scheduled job comparing provider state with yours — `scheduled-jobs`) and alerting on drift.
6. Plan tests with the provider's test mode and recorded event fixtures; every scenario maps to a test (`../../testing-strategy`).

## Decision Rules

- Entitlements change on verified provider events, not on client redirects.
- Duplicate or replayed events must be no-ops; out-of-order events must not regress state.
- Price and quantity always come from the server's catalogue, never the request.
- Prefer the provider's hosted checkout and billing portal unless a requirement rules them out — less card data, less PCI scope.
- In-app digital goods on mobile follow the store's billing rules; that is a product constraint, not a code detail.

## Rules

- Never store card numbers or CVCs; keep PCI scope minimal (`../../security/api-security`).
- Webhook secrets and API keys live in the secret store, never in code (`../../security/secrets-audit`).
- Money in integer minor units with an explicit currency.
- Every billing change is auditable: who, what, when, provider event ID.

## Anti-Patterns

- Granting access on the checkout success page.
- Charging without an idempotency key, so a retry double-charges.
- Trusting `plan` or `amount` from the client.
- Seat counts that drift because invites and removals don't update the subscription.
- No reconciliation, so drift is discovered by customers.

## Validation Checklist

- [ ] Billing scenarios cover success, decline, duplicate and out-of-order events, provider failure, and unauthorized actors — each with a test.
- [ ] Webhooks verified, deduplicated, ordered, processed asynchronously.
- [ ] Money-moving calls idempotent; state transitions atomic.
- [ ] Failed-payment path defined end to end, including what the customer sees.
- [ ] Reconciliation job and drift alert planned.
- [ ] No card data stored; secrets in the secret store.

## Definition of Done

A billing design where access always matches what was paid, retries and duplicate events cannot double-charge or double-grant, failures leave the customer informed and the records consistent, and every approved billing scenario has a passing test.

## Related Skills

`webhooks`, `third-party-integrations`, `scheduled-jobs`, `role-permission-design`, `../../database/transactions`, `../../security/api-security`, `../../testing/gherkin-specifications`, `../../mobile/mobile-release` (store billing).

## Related Knowledge

`../../../knowledge/backend/` (provider conventions), once populated.

## Related References

`../../../references/backend/` (provider docs and event catalogues), when added.

## Context Loading Guidance

- **Requires:** the billing scenarios, the provider's event model, the pricing model.
- **Does not require:** unrelated domain code, UI implementation.
- **May load:** `webhooks`, `../../database/transactions`.
- **Stop when:** the billing design and its test plan are recorded.

## Token Efficiency Guidance

Link the provider's event reference instead of copying it; describe states and transitions as a table, not prose.
