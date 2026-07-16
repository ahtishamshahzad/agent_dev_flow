# `.ai/mcp/` — Tool & MCP Integration Governance

Optional integrations with external tools and MCP (Model Context Protocol) servers. **Nothing here is enabled automatically.** Every tool is opt-in, least-privilege, and documented before use.

## Files

- **`TOOL_SELECTION.md`** — which tools/servers exist, their purpose, and when to enable each.
- **`PERMISSION_RULES.md`** — permission, data-exposure, and least-privilege rules for any tool.
- **`RECOMMENDED_SERVERS.md`** — a catalog of optional MCP servers with per-server guidance.

## Principles

- **Off by default.** Enable a tool only when a task needs it and the user approves.
- **Least privilege.** Grant the narrowest scope that accomplishes the task.
- **Document exposure.** Every enabled tool states what data it can see or change.
- **Prefer read-only** where the task allows it.

## Relationship to other rules

Tool use is bound by `../system/SECURITY_RULES.md` (do no harm, no data exfiltration) and `../system/OPERATING_RULES.md` (confirm outward-facing actions). Enabling a tool that can write, deploy, or reach production is an outward-facing action and requires explicit approval.
