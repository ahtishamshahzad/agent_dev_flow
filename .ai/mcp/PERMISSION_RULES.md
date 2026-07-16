# Permission Rules

The permission model for any tool or MCP server. Bound by `../system/SECURITY_RULES.md` and `../system/OPERATING_RULES.md`.

## Least privilege

- Grant the **narrowest scope** that accomplishes the task, for the **shortest time**.
- Prefer **read-only** over read-write; **scoped** over global; **staging** over production.
- Never enable a broad-scope tool "for convenience."

## Per-tool documentation (required before enabling)

For every tool, document:
- **Purpose** — what task it serves.
- **Permissions required** — exact scopes (read? write? deploy?).
- **Data exposure risk** — what data it can see or send outward, and where.
- **When it should be enabled** — the specific condition/task.
- **When it should remain disabled** — the default and the danger cases.

(See the catalog in `TOOL_SELECTION.md` and `RECOMMENDED_SERVERS.md`.)

## Approval requirements

- **Outward-facing or write-capable tools** (remote git, cloud, deploy, production DB, publishing) require **explicit user approval** for the specific task (`OPERATING_RULES.md` §9).
- **Read-only, repo-local, or staging-only** tools may be used within the approved plan, still recorded.
- Approval is **task-scoped**: approval for one task does not carry to the next.

## Data exposure

- Sending repository content, credentials, or user data to an external service is **publishing** — treat it as outward-facing. It may be cached/logged even if later deleted.
- Never transmit secrets or PII to a tool that doesn't strictly need them; redact where possible.
- Assume anything sent to a third-party MCP server leaves your trust boundary.

## Lifecycle

1. **Justify** — the task needs it.
2. **Scope** — minimal permissions.
3. **Approve** — if write/outward-facing.
4. **Record** — tool, scope, reason, in the work item.
5. **Use** — for that task only.
6. **Revoke/disable** — when done.

## Hard rules

- No production writes without explicit, task-specific approval.
- No secret/PII transmission beyond what the task strictly requires.
- No leaving elevated tool access enabled across tasks.
- On any doubt about exposure or reversibility, **stop and ask**.
