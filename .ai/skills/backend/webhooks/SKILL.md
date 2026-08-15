---
name: webhooks
description: Use to design webhooks in both directions — inbound (verify signatures, respond fast, process async, dedupe, handle out-of-order) and outbound (signing, retries with backoff, delivery tracking, consumer docs).
---

# Webhooks

## Purpose

Design webhook handling as the untrusted, unreliable channel it is: inbound hooks are verified, acknowledged fast, and processed idempotently; outbound hooks are signed, retried, and observable.

## When to Use

- Inbound: receiving events from providers (payments, messaging, git, etc.).
- Outbound: notifying customer/partner systems of your events.
- **Not** for internal service events (use `queues`).

## Inputs

- Provider list + their signature/retry semantics; events consumed.
- Outbound consumers + events published (`api-contracts` for payload shapes).

## Discovery Questions

- Inbound: what signature scheme and tolerance window does each provider use? What is the real source of truth (webhook payload vs re-fetch via API)?
- Which inbound events change money/state (payments!) — what happens on duplicate or out-of-order delivery?
- Outbound: what delivery guarantees do consumers get, and how do they recover from missed events?

## Responsibilities

**Inbound**
- **Verify signatures** on the raw body (before parsing/middleware mangling), with timestamp tolerance against replay; reject unverified with 4xx. Endpoint is public by necessity — signature is the gate, not obscurity.
- **Acknowledge fast, process async**: persist the event, return 2xx, hand work to `background-jobs`; provider timeouts + retries punish slow handlers.
- **Dedupe by event ID** (providers deliver at-least-once) and tolerate **out-of-order** delivery — process against current state, or re-fetch the object from the provider's API when the payload could be stale (the common payments pattern).
- Validate payload shape (`backend-validation`) — verified origin ≠ expected schema.

**Outbound**
- Sign payloads (HMAC + timestamp), document verification for consumers.
- Deliver via `background-jobs`/`queues`: retries with exponential backoff, terminal-failure handling (disable + notify after N days dead), delivery log per consumer.
- Version payloads (`api-contracts`); provide event IDs and a replay/reconciliation path for consumers.
- Document the unit as it is built — `docs/<app>/integrations/` (inbound and outbound contracts) (`../../application-documentation`).

## Required Workflow

1. Inventory inbound providers/events and outbound consumers/events.
2. Inbound: design verify → persist → ack → async-process pipeline with dedupe + ordering strategy per event type.
3. Outbound: design signing, retry schedule, delivery tracking, consumer docs.
4. Specify tests: bad/missing/replayed signature rejected; duplicate event processed once; out-of-order sequence converges; outbound retry + terminal path works.

## Decision Rules

- Raw-body signature verification comes before any body parsing — framework middleware order matters (`express-foundation`/`nestjs-foundation`).
- For money-bearing events, the webhook is a *trigger*; the provider API re-fetch is the truth.
- Inbound processing follows `background-jobs` idempotency rules; the webhook endpoint itself does no business logic.
- Outbound webhooks are a contract — shape changes follow `api-contracts` breaking-change policy.

## Rules

- No unverified inbound payload reaches business logic.
- Secrets per provider/consumer, rotatable (`backend-security`).
- Inbound endpoints excluded from CSRF but included in rate limiting at the infrastructure margin (`rate-limiting`).

## Anti-Patterns

- Verifying signatures on the re-serialized parsed body.
- Doing the full state change inline, then timing out and receiving the retry.
- Trusting webhook payload data over current provider state for payments.
- No dedupe — double-crediting on redelivery.
- Outbound: fire-once, no retries, no delivery log.

## Validation Checklist

- [ ] Inbound: raw-body signature verify + replay window per provider.
- [ ] Persist → ack fast → process async pipeline.
- [ ] Dedupe + out-of-order strategy per event type (re-fetch where stale-able).
- [ ] Outbound: signing, backoff retries, delivery tracking, consumer docs.
- [ ] Negative tests: bad signature, replay, duplicate, out-of-order.

## Definition of Done

A recorded two-direction webhook design — verified/deduped/async inbound, signed/retried/tracked outbound — with negative tests for signature, replay, duplication, and ordering.

## Related Skills

`background-jobs`, `queues`, `backend-validation`, `backend-security`, `third-party-integrations`, `api-contracts`, `backend-observability`, `../../application-documentation`.

## Related Knowledge

`../../../knowledge/` (provider list, consumer contracts).

## Related References

`../../../references/backend/integrations/` (provider notes, when populated).

## Context Loading Guidance

- **Requires:** provider/consumer inventory, event list, provider signature semantics.
- **Does not require:** unrelated endpoints, full provider SDK docs.
- **May load:** `background-jobs` (processing), `third-party-integrations` (provider clients).
- **Stop when:** both pipelines + tests are recorded.

## Token Efficiency Guidance

Design per provider/consumer as table rows (signature scheme, dedupe key, ordering strategy, retry policy); link provider docs.
