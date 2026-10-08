# Multi-agent — one baseline, isolated packs

> **Status: PROPOSED.** Fictional.

**Request:** "Customers can upload a profile photo" — split across three agents.

**Shared baseline (identical for all three):** global rules · `features/profile/photo-upload.feature` (approved) · the API contract `PUT /me/photo` (multipart, ≤5 MB, JPEG/PNG → `{photoUrl}`) · scope · the installed stack.

| Agent | Its pack | May modify |
|---|---|---|
| A — backend | upload route, storage service, its tests | `apps/api/src/profile/**` |
| B — web | profile page, the API client function | `apps/web/src/profile/**` |
| C — tests | the scenarios, the API and E2E test folders | `apps/api/test/profile/**`, `e2e/profile/**` |

No agent receives another's code, and none receives the whole repository.

**A contract change:** agent A finds the storage provider returns signed URLs that expire, so the response must be `{photoUrl, expiresAt}`. A stops and proposes the change; the orchestrator stops B and C, updates the contract and the scenario ("the photo is still shown after the link expires"), re-issues all three packs, and work continues. Nobody builds against the old contract.
