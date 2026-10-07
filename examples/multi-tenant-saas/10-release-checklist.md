# 10 — Release checklist (Gate 7)

> **Status: PROPOSED.** Fictional example. Stage: `release-planning`, `final-quality-audit`. Every box is unchecked — nothing has been built. In a real release each checked box links its evidence (a CI run, a report, a store review result).

## Quality

- [ ] All phase exit criteria met (06), each with its test passing in CI.
- [ ] Required cases covered per feature, including authorization denial (07).
- [ ] Offline E2E: airplane-mode completion syncs exactly once, with all photos.
- [ ] 200-photo PDF export under 60 s in the performance check.

## Security and privacy

- [ ] `security-review` on the built code: no open Confirmed Critical/High findings (08).
- [ ] Cross-tenant denial tests pass for every tenant endpoint.
- [ ] Secret scan clean; production secrets in the secret store only.
- [ ] Photo retention and deletion-on-request work end to end.
- [ ] Human security review completed (money + personal data).

## Billing

- [ ] Stripe live mode configured; webhook signing secret set; replayed and out-of-order events handled.
- [ ] Seat sync verified against real invites and deactivations in staging.

## Delivery

- [ ] Staging mirrors production; migrations rehearsed on a copy of staging data.
- [ ] Rollback plan written and rehearsed (`rollback-planning`).
- [ ] Monitoring and alerts on API errors, sync failures, webhook failures, queue backlog.
- [ ] iOS and Android readiness checks pass (`ios-readiness`, `android-readiness`); store listings and privacy labels done.
- [ ] Docs in `docs/<app>/` match what shipped.

## Approval

- [ ] **Explicit approval to deploy and to submit to the stores.** Nothing is published without it.
