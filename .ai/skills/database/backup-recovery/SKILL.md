---
name: backup-recovery
description: "Use to plan backups and recovery — RPO/RTO targets, automated backups with point-in-time recovery where needed, off-site/cross-account copies, retention, encryption, and above all restore drills: an untested backup is a hope, not a plan."
---

# Backup & Recovery

## Purpose

Make data loss survivable, provably: recovery objectives set by the business, backups that meet them automatically, and **rehearsed restores** — because the only backup that counts is one that has been restored.

## When to Use

- When provisioning any database, and periodically to re-verify (drills).
- Before risky operations: `data-migration` runs, major `database-migrations`, deletions.
- **Not** as an afterthought at release — recovery objectives are requirements.

## Inputs

- Business tolerance: how much data loss (RPO) and downtime (RTO) is survivable per dataset.
- Platform capabilities (managed snapshots, PITR/WAL archiving, Mongo oplog), data volume.

## Discovery Questions

- What do RPO/RTO actually need to be — an hour of lost orders vs a day of lost analytics differ (`database-selection` knows what lives where)?
- What failure classes are covered: hardware, region, **operator error (bad migration, fat-fingered delete — the common one)**, account compromise, ransomware?
- Who restores at 3 a.m., following what runbook, with what access?

## Responsibilities

- Set **RPO/RTO per dataset** with the business — recorded numbers, not vibes; they drive everything below.
- Design the **backup scheme** to meet them: automated scheduled full backups + **point-in-time recovery** (WAL/oplog archiving) where RPO is minutes; frequency, retention tiers (daily/weekly/monthly), and pruning policy recorded.
- Protect the backups themselves: **off-site/cross-account/cross-region copies** (a backup in the blast radius — same account, same region, deletable by the same compromised key — is not a backup); encryption at rest with keys managed separately (`database-security`); immutability/deletion-protection where the platform offers it.
- Cover operator error explicitly: PITR to just-before-the-mistake; **pre-operation snapshots** as a standard step for `data-migration`/destructive `database-migrations`.
- Write the **restore runbook**: exact steps, access needed, decision points (restore-in-place vs parallel-and-cutover, partial-table extraction), verification steps — executable by the on-call human, not just its author.
- **Drill restores on a schedule**: full restore to a scratch environment, timed against RTO, data verified (counts/spot checks); every drill recorded; a failed drill is a production incident in rehearsal — fix it.
- Monitor the pipeline: backup success/failure and *staleness* alerts (`../../backend/backend-observability`) — silent backup death is the classic failure.
- Align PII retention/deletion with backups (`database-security`): deleted-user data in year-old backups is a recorded, compliance-checked policy, not a surprise.

## Required Workflow

1. Record RPO/RTO per dataset with the business.
2. Configure automated backups + PITR to meet them; set retention.
3. Establish off-site copies, encryption, deletion protection.
4. Write the restore runbook.
5. Drill: restore, time it, verify data, record results; schedule recurrence.
6. Wire failure/staleness alerts; standardize pre-operation snapshots.

## Decision Rules

- RPO/RTO come from the business impact, and the scheme is derived — never the reverse ("daily dumps, so RPO is 24h, hope that's fine").
- Managed-platform backups are the default start; verify their restore path and cross-region story rather than assuming.
- Replicas are availability, **not backups** — they replicate the delete too.
- If the restore has never been run, the backup doesn't exist yet.

## Rules

- Restore drills on a schedule, recorded, timed against RTO.
- Backup credentials/keys separated from production compromise paths.
- Every destructive operation is preceded by its snapshot (and says so in its runbook).

## Anti-Patterns

- Nightly dump to the same disk/account and calling it covered.
- Backups configured once, never verified, dead for months.
- Replicas as the backup strategy.
- Restore knowledge living in one person's head.
- Discovering the backup excludes half the schemas during the incident.
- No PITR on a system whose RPO is "minutes, obviously."

## Validation Checklist

- [ ] RPO/RTO recorded per dataset.
- [ ] Automated backups + PITR meet them; retention set.
- [ ] Off-site/cross-account copy, encrypted, deletion-protected.
- [ ] Restore runbook written and executable by on-call.
- [ ] Restore drill done, timed, verified, scheduled to recur.
- [ ] Staleness/failure alerts wired; pre-op snapshots standard.

## Definition of Done

Recorded recovery objectives met by an automated, off-site, encrypted backup scheme with PITR where needed — proven by a timed, verified, recurring restore drill, with a runbook on-call can execute and alerts watching the pipeline.

## Related Skills

`database-security`, `data-migration` (pre-op snapshots), `database-migrations`, `../../backend/backend-deployment`, `../../backend/backend-observability`, `../../release-planning` (readiness gate).

## Related Knowledge

`../../../knowledge/` (business tolerance, platform capabilities).

## Related References

`../../../references/database/operations/` (runbooks, drill records, when populated).

## Context Loading Guidance

- **Requires:** RPO/RTO inputs, platform capabilities, dataset inventory.
- **Does not require:** schema detail, application code.
- **May load:** `database-security` (encryption/PII), `data-migration` (snapshot step).
- **Stop when:** scheme + runbook + drill results are recorded.

## Token Efficiency Guidance

The RPO/RTO → scheme table and the drill log are the artifacts; keep platform specifics to links in references.
