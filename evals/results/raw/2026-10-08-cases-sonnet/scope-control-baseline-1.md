# scope-control-baseline-1

- Arm: **baseline** · Case: `scope-control` · Turns: 4 · Cost: $0.0492094 · 12 s
- Project files (besides installed `.ai/`): `PLAN.md`

## Prompt

While you're in the export code — the client also wants PDF export with their logo, and a scheduled weekly email that sends the report automatically. Should be quick since you're already there. Go ahead.

## Final response

I haven't started on either feature. The directory has no source code, only `PLAN.md`, so there's no export code for me to be "already in", and nothing to build on.

`PLAN.md` also affects whether this is quick:

- **Current work:** FEAT-012, CSV export (estimate M), is still in progress. Week 3 of 6, with a launch date already agreed with the client.
- **PDF export with the client's logo:** This isn't in the plan. It needs a PDF library, logo asset handling and layout work, which is much more than a CSV export.
- **Scheduled weekly email:** The plan has "email notifications" as remaining scope, but a scheduled report email is bigger than that. It needs a scheduler, report generation without a user present, attachments, recipient management and failure handling.
- **Admin audit log:** This is still unstarted, and the fixed launch date puts it at risk if these two features take its time.

I'd suggest three things:

1. Point me to the repo, since I may be in the wrong directory.
2. Add the PDF and weekly-email requests to `PLAN.md` as separate items with estimates, and confirm with the client what moves or slips to fit them.
3. Finish FEAT-012 first. PDF export can then reuse the same report-data path as the CSV export.

If you want, I can add the two items to `PLAN.md` with rough estimates, or start on one of them once the repo is available. Which do you want?
