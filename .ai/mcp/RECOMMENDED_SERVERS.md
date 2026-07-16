# Recommended Servers

A catalog of **optional** MCP/tool servers. None are enabled by default. Each entry follows the permission-documentation requirement from `PERMISSION_RULES.md`: purpose, permissions, data-exposure risk, enable-when, disable-when.

> Availability of any specific server depends on the environment. Treat this as a decision guide, not an install list.

---

## GitHub
- **Purpose:** manage issues, PRs, reviews, repo metadata, CI status.
- **Permissions:** repo read (metadata/PRs); write only for approved PR/issue actions.
- **Data exposure:** repo contents and metadata to the GitHub API.
- **Enable when:** doing approved PR/issue work on an existing repo.
- **Disable when:** no repo work; **or** before repository creation is approved (Phase 1 forbids repo creation).

## Figma
- **Purpose:** read design files, tokens, specs to build accurate UI.
- **Permissions:** read-only design access.
- **Data exposure:** design content pulled into context.
- **Enable when:** implementing UI from real Figma designs.
- **Disable when:** no design source or speculative UI.

## Browser automation
- **Purpose:** navigate and inspect live web pages.
- **Permissions:** control a browser session; network access to visited sites.
- **Data exposure:** page content, and anything typed, leaves to visited sites.
- **Enable when:** verifying real web behavior on trusted sites.
- **Disable when:** untrusted sites, or actions that could trigger destructive UI flows.

## Playwright
- **Purpose:** author/run web end-to-end tests; programmatic page control.
- **Permissions:** launch browsers, run test scripts.
- **Data exposure:** test data and target-app content.
- **Enable when:** web E2E testing is in scope.
- **Disable when:** no web app or unit-level work only.

## Filesystem
- **Purpose:** read/write files outside the repository.
- **Permissions:** scoped path access — never broader than needed.
- **Data exposure:** any file in the granted scope.
- **Enable when:** a task genuinely needs external files.
- **Disable when:** repo-local work (use normal file tools instead).

## Database
- **Purpose:** inspect/query a database; verify migrations.
- **Permissions:** **read-only preferred**; write only for approved, non-production tasks.
- **Data exposure:** potentially PII/business data — handle per `../system/SECURITY_RULES.md`.
- **Enable when:** debugging data or verifying schema against a **non-production** DB.
- **Disable when:** production DB without explicit, task-specific approval.

## Docker
- **Purpose:** build/run containers for reproducible environments and integration tests.
- **Permissions:** local Docker daemon.
- **Data exposure:** build context (watch for secrets in images).
- **Enable when:** reproducing environments or running containerized tests.
- **Disable when:** no container need; never point at production hosts casually.

## Cloud services
- **Purpose:** provision, deploy, or inspect cloud resources.
- **Permissions:** scoped cloud credentials — least privilege, staging first.
- **Data exposure:** infrastructure state and potentially production data.
- **Enable when:** an **approved** deployment/ops task requires it.
- **Disable when:** any unapproved production change; keep off by default.

## Issue trackers
- **Purpose:** read/update tickets (Jira, Linear, etc.).
- **Permissions:** read; write only for approved updates.
- **Data exposure:** ticket contents to the tracker service.
- **Enable when:** syncing work items to an external tracker.
- **Disable when:** reads not needed or writes not approved.

---

## Adding a server

To add a new server here: document the same six fields (purpose, permissions, data exposure, enable-when, disable-when), default it to **disabled**, and require approval for any write/outward-facing scope.
