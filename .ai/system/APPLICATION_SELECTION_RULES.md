# Application Selection Rules

Decide **which applications a project actually needs** — independently, with justification. Do not auto-scaffold every possible application. Each application is a separate decision with its own cost, audience, and lifecycle.

## Candidate applications to evaluate

Evaluate each of these on its own merits:

- **Mobile app** — native/cross-platform app for end users on phones/tablets.
- **Public customer web app** — the product web experience for end users.
- **Admin dashboard** — internal/operator tooling; *separate from the public web app*.
- **Marketing site** — public informational/landing site; often separate from the product app.
- **Backend API** — server exposing business logic/data to clients.
- **Background worker** — async jobs, queues, scheduled tasks.
- **Real-time service** — websockets/streaming/presence/live updates.
- **Database** — persistent storage (see `STACK_DECISION_RULES.md` for pairing).
- **File storage** — object/blob storage for uploads/media.
- **Shared packages** — internal libraries (types, UI, utilities) shared across apps.

## Decision procedure

For each candidate, answer:
1. **Is there a real user or system need it serves?** (Who uses it? For what?)
2. **Can an already-selected application absorb this responsibility** without harming clarity or scale?
3. **Does it have a distinct audience, deploy target, or lifecycle** that justifies separation?
4. **What is the cost** to build, run, and maintain it now vs. deferring it?

Select an application only when the need is real and not better served by an existing one.

## Explicit separations

- **Public web app ≠ admin dashboard.** Different audiences, permissions, and risk. Evaluate and (if chosen) build them separately.
- **Marketing site ≠ product web app.** Different content, cadence, and often stack. Do not merge by default.
- **Backend API ≠ database.** The API is code; the database is storage. Both may be needed; they are separate selections.

## Anti-patterns

- Scaffolding mobile + web + dashboard + backend + DB automatically because "it's a full-stack project."
- Adding a real-time service or worker before any feature requires async/live behavior.
- Creating shared packages before there are ≥2 real consumers.
- Treating "we might need it later" as justification to build it now — record it as a **deferred** candidate instead.

## Output of this stage

Produce, for the approval gate:
- **Selected applications** with a one-line justification each.
- **Deferred candidates** with the trigger that would justify them later.
- **Explicitly excluded** candidates with the reason.

Record this in `../projects/current/`. Application selection feeds `STACK_DECISION_RULES.md` and `PHASE_GENERATION_RULES.md`.
