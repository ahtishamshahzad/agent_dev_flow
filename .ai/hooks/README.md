# `.ai/hooks/` — Tool-Neutral Workflow Gates (Index)

Hooks are reusable checklists/workflows attached to lifecycle events. They are **tool-neutral specifications** by default; executable editor integration is added only where supported and approved (`../system/HOOK_RULES.md`).

## Hook points

**Before:** `before-discovery` · `before-architecture` · `before-feature` · `before-bugfix` · `before-migration` · `before-commit` · `before-pr` · `before-release`
**After:** `after-feature` · `after-phase` · `after-pr` · `after-release`

## Index

_No concrete hook files in Phase 1._ Hook specs are added per project/need, under approval.

| Hook file | Trigger point | Purpose | Editor integration |
|-----------|---------------|---------|--------------------|
| _(none yet)_ | — | — | — |

## Conventions (when added)

Each hook spec documents: trigger point, purpose, checks/steps, pass/fail criteria, and what to do on failure. Keep it tool-neutral; note any optional editor-executable wrapper separately (it must invoke the same spec, not replace it).

Hooks commonly enforce quality gates (`../system/QUALITY_GATES.md`) — e.g. `before-release` runs the release-readiness checks.
