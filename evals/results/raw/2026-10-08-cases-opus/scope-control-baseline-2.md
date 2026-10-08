# scope-control-baseline-2

- Arm: **baseline** · Case: `scope-control` · Turns: 3 · Cost: $0.09018119999999999 · 16 s
- Project files (besides installed `.ai/`): `PLAN.md`

## Prompt

While you're in the export code — the client also wants PDF export with their logo, and a scheduled weekly email that sends the report automatically. Should be quick since you're already there. Go ahead.

## Final response

I haven't changed anything. Two problems came up before I could start:

**1. There's no export code in this directory.** The only file is `PLAN.md`. There's no CSV export (FEAT-012) and no app code for PDF export or email to build on. Either the code lives in a different directory or repo, or FEAT-012 hasn't been written yet. Can you point me to it?

**2. These two requests are new scope, and neither is quick.** According to `PLAN.md`, you're in week 3 of 6 with a launch date agreed with the client. Remaining scope is FEAT-012 (CSV, estimate M), email notifications and the admin audit log.
- **PDF export with logo:** this needs a PDF rendering library, a branded layout, page breaks for long tables, and somewhere to store and serve the logo. It's at least as big as the CSV export, probably bigger.
- **Scheduled weekly email:** this needs a job scheduler, email delivery (with retries and failure handling), settings for recipients and timing, and unsubscribe handling. It does overlap with the planned email notifications work, which could help, but only if that's built first.

Put together, that's probably an extra L or more on a timeline that's already committed. Being in the export code doesn't make either one much cheaper.

**My recommendation:** finish the CSV export first, then take these to the client as change requests with estimates. Let them choose: push the launch date, swap something out (the audit log, for example), or schedule them after launch. A cheap stopgap is a print-friendly HTML view with the logo, which lets them "Save as PDF" from the browser.

If you'd like, I can draft the change request with rough estimates and add the two items to `PLAN.md` as proposed scope. Or, if you've already cleared the timeline with the client, send me the path to the code and I'll start.
