# <Unit name — the screen, page, endpoint, or job as users/callers know it>

> Template for one unit file under `docs/<app>/<units>/`. Placement and naming: `../skills/application-documentation`. Delete the sections that don't apply — an accurate short doc beats a padded one.

**App:** `<mobile | web | admin | backend | …>` · **Route / path / trigger:** `<"/auth/login" · Login screen · POST /api/auth/login · nightly 02:00>` · **Source:** `<path/to/entry.ts>`

## What it is

One or two sentences: what this unit does and who it is for. Not how it is implemented.

## How you reach it

Route, navigation path, endpoint + method, or trigger. Include what must be true to reach it — signed in, a given role, a feature flag, a prior step in a flow.

## Inputs

| Name | Type | Required | Notes |
|------|------|----------|-------|
| `<field>` | `<type>` | yes/no | `<constraint, default, where it comes from>` |

For a screen: params it accepts. For an endpoint: request body/query. For a job: its payload and schedule.

## Behavior

What happens on the happy path, in order. Include the states a reader would otherwise have to discover: loading, empty, partial, offline.

## Output

What the caller/user gets back — response shape, navigation target, side effects (emails sent, rows written, events published).

## Failure modes

| Case | What happens | Status / UX |
|------|--------------|-------------|
| `<invalid input>` | `<validation message, no write>` | `<400 · inline field error>` |
| `<not authorized>` | `<denied, nothing leaked>` | `<403 · redirect to …>` |

Authorization denial is a documented case, not an afterthought.

## Permissions

Who may use this, expressed in the project's own terms (role, ownership, tenant). Enforcement is server-side; note where it happens.

## Dependencies

Other units, services, or tables this relies on — link to their docs. Environment variables by **name and purpose only**, never values.

## Notes

Known limitations, deliberate trade-offs, and links to the decision that produced them. Planned work belongs in `../work-items/`, not here.
