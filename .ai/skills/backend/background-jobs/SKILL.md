---
name: background-jobs
description: Use to decide what work leaves the request path and to design background job execution — job boundaries, payloads, idempotency, retries with backoff, failure handling, and result/status reporting. Queue infrastructure itself is the queues skill.
---

# Background Jobs

## Purpose

Move work that shouldn't block a request (slow, retryable, bursty, or failure-prone) into background jobs designed for reality: retries, duplicates, partial failures. This skill owns *what runs in the background and how a job behaves*; `queues` owns the transport/infrastructure; `scheduled-jobs` owns time-triggered work.

## When to Use

- When requests do slow work inline (email, media processing, exports, third-party calls, fan-out updates).
- **Not** for choosing queue infrastructure (`queues`) or cron-style triggers (`scheduled-jobs`).

## Inputs

- Endpoint inventory with slow/expensive operations; latency expectations.
- Failure tolerance per operation (must-happen vs best-effort).

## Discovery Questions

- Which request-path operations exceed acceptable latency or can fail independently of the request?
- Per job: what happens if it runs twice? Runs late? Never runs?
- How does the client learn the outcome (polling a status, push, nothing)?

## Responsibilities

- Draw the line: request path does validation + authorization + the core state change; deferrable side effects (notifications, processing, syncs) become jobs.
- Design job payloads: small, serializable, self-contained IDs — the job re-reads current state; it doesn't trust a stale snapshot.
- Make every job **idempotent** (natural idempotency, dedup keys, or state checks) — retries and at-least-once delivery guarantee duplicates.
- Define retry policy per job: max attempts, exponential backoff, what's retryable vs terminal; terminal failures go to a dead-letter path with alerting (`queues`, `backend-observability`).
- Preserve scope: jobs touching tenant/user data carry and enforce the same scoping as requests (`ownership-authorization`).
- Design status visibility where users wait on results (job status records, notifications).
- Document the unit as it is built — one file per job under `docs/<app>/jobs/` (`../../application-documentation`).

## Required Workflow

1. Inventory deferrable operations; classify must-happen vs best-effort.
2. Define each job: payload, idempotency mechanism, retry policy, failure handling.
3. Decide enqueue timing relative to the database transaction (see Decision Rules).
4. Define status/result reporting where needed.
5. Specify tests: duplicate execution is safe, retry path works, terminal failure alerts.

## Decision Rules

- Enqueue **after** (or transactionally with — outbox pattern) the commit: a job referencing uncommitted state, or a commit whose job was never enqueued, are both bugs. For must-happen jobs, prefer the outbox pattern (`../../database/transactions`).
- Payloads carry IDs, not entities.
- A job that must not run twice needs an idempotency mechanism, not hope.
- Best-effort jobs may drop after N retries with a log; must-happen jobs never silently drop.

## Rules

- No fire-and-forget promises inside request handlers as a "queue."
- Every job has an owner-visible failure story (DLQ + alert, or recorded best-effort).
- Job handler errors flow through the error-handling design (`backend-error-handling`).

## Anti-Patterns

- Sending email/processing media inline in the request.
- `void doWork()` in a handler — lost on crash, invisible on failure.
- Jobs that assume exactly-once delivery.
- Fat payloads carrying entity snapshots that go stale.
- Background jobs skipping tenant scoping "because they're internal."

## Validation Checklist

- [ ] Deferrable operations inventoried and classified.
- [ ] Each job: payload (IDs only), idempotency, retry policy, failure path.
- [ ] Enqueue-vs-commit ordering decided (outbox where must-happen).
- [ ] Scoping preserved in job execution.
- [ ] Status reporting designed where users wait.
- [ ] Tests: duplicate-safe, retryable, terminal-alerts.

## Definition of Done

A recorded job design — boundaries, idempotent handlers, retry/failure policy, commit-safe enqueueing, preserved scoping, status visibility — with duplicate-execution tests specified.

## Related Skills

`queues`, `scheduled-jobs`, `../../database/transactions`, `../../database/concurrency`, `backend-error-handling`, `backend-observability`, `ownership-authorization`, `email-notifications`, `../../application-documentation`.

## Related Knowledge

`../../../knowledge/` (latency budgets, failure tolerance).

## Related References

`../../../references/backend/jobs/` (job inventory, when populated).

## Context Loading Guidance

- **Requires:** slow-operation inventory, failure tolerance per operation.
- **Does not require:** queue vendor detail (delegate), unrelated endpoints.
- **May load:** `queues` (transport), `../../database/transactions` (outbox).
- **Stop when:** the job inventory with idempotency/retry/failure design is recorded.

## Token Efficiency Guidance

The job table (trigger, payload, idempotency, retries, failure path) is the deliverable; one row per job.
