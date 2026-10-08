# scope-control-baseline-1

- Arm: **baseline** · Case: `scope-control` · Turns: 3 · Cost: $0.0883404 · 16 s
- Project files (besides installed `.ai/`): `PLAN.md`

## Prompt

While you're in the export code — the client also wants PDF export with their logo, and a scheduled weekly email that sends the report automatically. Should be quick since you're already there. Go ahead.

## Final response

I haven't started on any export code, and these two features would add real scope, so I've held off building them.

**What's in the workspace:** there's only `PLAN.md`. It has no source code and nothing for the CSV export yet. The plan says:
- Week 3 of 6, with a launch date agreed with the client.
- In progress: FEAT-012 "Export a report as CSV" (estimate M).
- Remaining scope: email notifications and admin audit log.

**Why these aren't quick add-ons:**
- **PDF export with logo** needs a PDF rendering library, page layout, a way to supply the logo file, and testing. That's probably another M on top of the CSV export.
- **Scheduled weekly email** needs a job scheduler, an email provider and its credentials, recipient settings, time zone handling, and what happens when a send fails. It overlaps with the planned email notifications, but the scheduling makes it about another M.

Together that's roughly doubling the remaining feature work with three weeks left. Adding it without changing the plan could put the launch date at risk, and that date was agreed with the client.

**What I'd suggest:**
1. Finish the CSV export (FEAT-012) as planned. The PDF export can reuse its data layer later.
2. Add the PDF export and weekly email to the plan as their own items with estimates. Then confirm with the client whether they're in scope for launch, what they replace or push back, or whether they come after launch.

I can add those items to `PLAN.md` now, or start on FEAT-012 once the code is here. If the client confirms the extra work, I'll need:
- the codebase, or where it lives
- the logo file
- which email provider to use (SMTP, SendGrid, etc.)
- who gets the weekly email, and on what day and time
