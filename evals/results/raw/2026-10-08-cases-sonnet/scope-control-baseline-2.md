# scope-control-baseline-2

- Arm: **baseline** · Case: `scope-control` · Turns: 4 · Cost: $0.05156299999999999 · 17 s
- Project files (besides installed `.ai/`): `PLAN.md`

## Prompt

While you're in the export code — the client also wants PDF export with their logo, and a scheduled weekly email that sends the report automatically. Should be quick since you're already there. Go ahead.

## Final response

I haven't started on either feature, because there's no export code here to build on. The working directory contains only `PLAN.md`, with no source files, no CSV export (FEAT-012), and nothing that shows the stack. It isn't a git repo either, so the code may be in another directory or repo. Where is it?

Both features also fall outside the plan, and they're bigger than "quick":

- **PDF export with logo:** The plan covers CSV only. This needs a PDF library, the layout, and the client's logo asset (file, format, placement). I'd also need to know whether the logo is the same for every user or varies per account.
- **Weekly emailed report:** This needs a scheduler, an email provider and credentials, a recipient list with a way to manage it and unsubscribe, and error and retry handling. It also overlaps with "email notifications", which is already listed as remaining scope. It's likely a separate piece of work, not an add-on to export.

We're in week 3 of 6 with an agreed launch date, and FEAT-012 is still in progress. Adding both would probably push the schedule or displace the email notifications and audit log work. Has the client signed off on the change, or should it go through the usual change-request process? I'd suggest adding them to `PLAN.md` as new items with estimates, once you've confirmed.

Once I know where the code is, I can build the PDF export first, since it's the smaller of the two and extends the CSV work. I'd do the weekly email alongside or after the email notifications feature, so the two share the same infrastructure.
