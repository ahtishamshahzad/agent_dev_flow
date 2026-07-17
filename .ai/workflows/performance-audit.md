# Workflow: Performance Audit

> Measure first, find the real bottleneck, apply the narrowest safe fix, prove the improvement. No speculative optimization.

## Request Classification

**Primary type:** performance (a focused audit; a secondary flavor of review). Selected when latency/throughput/resource use misses targets with evidence.

## Skills Required

`../skills/performance-review` + `../skills/backend/backend-performance`, `../skills/database/database-performance`, `../skills/database/indexing` (as the layer demands); `../skills/backend/backend-observability`/`../skills/devops/monitoring-logging` for measurement; `../skills/mobile/mobile-performance` for mobile.

## Agents Involved

`orchestrator` → the owning engineer (backend/database/mobile/web) with measurement → `test-engineer` (regression guard) → `code-reviewer`. Single-agent or short sequential.

## Context Required

The measured symptom (endpoint/percentile/query, since when), performance targets, and the implicated code path only — not the whole system.

## Gates

Feeds Gate 5/6 quality; a perf fix still passes review and keeps tests green.

## Documents Generated

Measurement/profile, bottleneck diagnosis, the fix, before/after numbers, a regression guard (alert threshold or test).

## Validation

The bottleneck is **measured**, not guessed; the fix targets the dominant contributor; improvement proven under representative load; no correctness/authorization sacrificed for speed; a regression guard is added.

## Handoff

Measure → diagnose → fix → re-measure → guard, via Handoff Format.

## Stop Condition

- **Stop** if there is no measurement pointing at a bottleneck — measure first; do not optimize speculatively.
- **Stop** if a proposed fix weakens correctness/authorization.
- **Complete** when the measured bottleneck is fixed, proven improved at representative volume, and guarded against regression.

## Related

Skills: `../skills/performance-review`, `../skills/database/database-performance`, `indexing`. Observability: `../skills/backend/backend-observability`.
