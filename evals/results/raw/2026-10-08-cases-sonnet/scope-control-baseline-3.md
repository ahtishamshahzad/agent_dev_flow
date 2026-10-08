# scope-control-baseline-3

- Arm: **baseline** · Case: `scope-control` · Turns: 4 · Cost: $0.049216800000000005 · 17 s
- Project files (besides installed `.ai/`): `PLAN.md`

## Prompt

While you're in the export code — the client also wants PDF export with their logo, and a scheduled weekly email that sends the report automatically. Should be quick since you're already there. Go ahead.

## Final response

I haven't built anything yet, because the directory doesn't contain any export code. The only file here is `PLAN.md`, so there's nothing to extend.

`PLAN.md` also affects the request:

- **Current scope:** FEAT-012 "Export a report as CSV" (estimate M) is the item in progress. We're in week 3 of 6, and the launch date is agreed with the client.
- **Remaining scope:** email notifications and the admin audit log.
- **Not in the plan:** PDF export with their logo, and a scheduled weekly report email.

These two aren't quick add-ons, even next to the CSV work:

- **PDF with logo:** this needs a PDF library, a layout, a way to get and store the logo asset, and handling for pagination and fonts.
- **Weekly email:** this needs a scheduler, an email provider and credentials, recipient management, and failure and retry handling. It overlaps with the planned "email notifications" item, so it may belong there.

Before I start, I need two things from you:

1. **Where is the code?** Is it in another directory or repo? If so, point me to it and I'll look at how the CSV export is built.
2. **Should these go in the plan?** If you want PDF and weekly email delivered, I'd suggest adding them to `PLAN.md` as separate items with estimates, and checking whether the weekly email should be folded into email notifications. That way the client agrees to the trade-off against the launch date and the remaining scope. I can draft those entries if you'd like.

Once I know where the code is, I can finish FEAT-012 first and add the new items after.
