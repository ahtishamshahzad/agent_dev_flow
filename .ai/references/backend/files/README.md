# References — Backend / File Storage

> Topic reference folder. Agents read this folder **only when the active task needs it** (`../../../system/CONTEXT_MANAGEMENT_RULES.md`, `TOKEN_OPTIMIZATION_RULES.md`) — never the whole tree. Starts empty; material is added as the project develops. **Do not create fake reference content.**

## What belongs here

File upload and storage reference material: accepted MIME types and size ceilings, storage layout and key naming, signed-URL issuance and expiry patterns, image/document processing pipelines, retention/deletion rules, and scanning hooks. **No bucket credentials.**

## Supported file types

Markdown (`.md`) for notes and patterns; small code snippets in fenced blocks; diagrams.

## Naming conventions

`kebab-case` by concern (`upload-validation.md`, `storage-layout.md`, `signed-urls.md`).

## How agents should use it

Read when implementing or reviewing uploads/downloads, alongside `../../../skills/backend/file-storage`. Upload validation is enforced server-side; client-side checks are UX only. Pair with `../security/` for content-type and traversal risks.

## References are not requirements

Material here is **context, not commitment.** A retention or size policy noted here is **not** in force until implemented and tested. Requirements/tasks and gate approval govern the build (`../../../system/QUALITY_GATES.md`). Cite when it informs the work; never let it silently drive scope. **Never store secrets here.**
