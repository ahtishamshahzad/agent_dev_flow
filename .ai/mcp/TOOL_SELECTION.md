# Tool Selection

Which optional tools/MCP integrations exist and **when to enable each**. Do not enable every server automatically. Select per task, least privilege, with approval.

## Selection procedure

1. Identify what the **active task** actually requires (read a repo? drive a browser? query a DB?).
2. Check whether the task can be done **without** an external tool first.
3. If a tool is warranted, pick the **narrowest** one and the **narrowest scope**.
4. Confirm enablement with the user for anything that can **write, deploy, or reach production**.
5. Record which tool was enabled, why, and its scope in the work item / `../projects/current/`.
6. **Disable** it when the task is done.

## Tool catalog (evaluate per need)

| Tool | Typical purpose | Enable when | Keep disabled when |
|---|---|---|---|
| **GitHub** | Issues/PRs/repo metadata/CI | Managing PRs/issues for approved work | No repo work; or before repo creation is approved |
| **Figma** | Read design specs/tokens | Building UI from real designs | No design source; speculative UI |
| **Browser automation** | Navigate/inspect live pages | Verifying web behavior, scraping allowed content | Untrusted sites; anything that could trigger destructive actions |
| **Playwright** | Web E2E / page control | Running/authoring web E2E tests | No web app; unit-level work |
| **Filesystem** | Read/write outside the repo | A task genuinely needs external files | Repo-local work (use normal file tools) |
| **Database** | Query/inspect a DB | Debugging data, verifying migrations (prefer read-only) | Production DB without explicit approval |
| **Docker** | Build/run containers | Reproducing envs, integration testing | No container need; production hosts |
| **Cloud services** | Provision/deploy/inspect | Approved deployment/ops tasks | Any unapproved production change |
| **Issue trackers** | Read/update tickets | Syncing work items to a tracker | Read-not-needed or unapproved writes |

See `RECOMMENDED_SERVERS.md` for per-server detail and `PERMISSION_RULES.md` for the permission model.

## Defaults

- **Read-only first.** Prefer inspect/query modes over write modes.
- **Production is special.** Any tool that can touch production (DB, cloud, deploy) is off until explicitly approved for a specific task.
- **One task, one scope.** Don't leave broad tool access enabled across unrelated tasks.
