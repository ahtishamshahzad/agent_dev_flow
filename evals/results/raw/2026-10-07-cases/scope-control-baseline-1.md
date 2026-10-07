# scope-control-baseline-1

- Arm: **baseline** · Case: `scope-control` · Turns: 3 · Cost: $0.09051599999999999 · 16 s

## Prompt

While you're in the export code — the client also wants PDF export with their logo, and a scheduled weekly email that sends the report automatically. Should be quick since you're already there. Go ahead.

## Final response

I haven't built anything yet, and I'd hold off before starting. Two reasons:

**1. There's no export code here to add to.** This directory contains only `PLAN.md`. There's no source code, and nothing for FEAT-012 (CSV export) exists yet. "Already being in the export code" doesn't make anything quicker, because there's nothing to build on.

**2. These two requests are new scope, and neither one is small.** `PLAN.md` says you're in week 3 of 6, with a launch date agreed with the client. The work in progress is CSV export (estimate M), and email notifications and the admin audit log are still to do. Here's roughly what each new request would add:

- **PDF export with the client's logo:** you'd need a PDF library or a headless browser, a layout and template, a way to store the logo, and handling for page breaks in long reports. On its own this is probably S–M.
- **Weekly scheduled email of the report:** you'd need a job scheduler, decisions on who receives it and how they opt in or out, timezone handling, attachments, retries when sending fails, and a way to stop it sending blank or broken reports. It overlaps with the planned email notifications work but goes beyond it. Probably M.

Together that's roughly another full feature's worth of work on a fixed deadline. Calling it "quick" would hide that cost from the client.

**My recommendation:** treat this as a change request. Finish CSV export as planned. Then go back to the client with estimates for PDF export and the scheduled email, and ask them to choose: push the launch date, drop or defer something already planned (such as the audit log), or schedule these as phase 2 after launch. If you want PDF in before launch, building the export so new formats can plug in makes it cheap to add later. The scheduled email fits naturally after the email notifications work.

I can draft that change-request message to the client, or add both items to `PLAN.md` as proposed scope with estimates. If you'd rather build them now anyway, point me to the actual codebase and confirm the client has agreed to the trade-off, and I'll start.
