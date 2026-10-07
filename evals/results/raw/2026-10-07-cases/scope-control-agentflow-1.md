# scope-control-agentflow-1

- Arm: **agentflow** · Case: `scope-control` · Turns: 6 · Cost: $0.16632940000000002 · 28 s

## Prompt

While you're in the export code — the client also wants PDF export with their logo, and a scheduled weekly email that sends the report automatically. Should be quick since you're already there. Go ahead.

## Final response

I haven't built either one yet. Under this project's rules, both requests are a **scope change**, and that needs your approval before any code is written.

**Why I stopped**

- The only work approved right now is FEAT-012 "Export a report as CSV". After that, the remaining approved work is email notifications (FEAT-013) and the admin audit log (FEAT-014). We're in week 3 of 6, and the launch date is already agreed with the client.
- Neither PDF export nor scheduled email is covered by an approved Gherkin scenario (the plain-language behavior specs the client signs off on). The rules say new behavior can't be slipped into the current task, even when the code sits right next to it.
- Both features need things the project doesn't have yet:
  - **PDF with logo:** a PDF rendering library (new dependency, so a stack decision), plus somewhere to store and upload the logo.
  - **Weekly scheduled email:** a job scheduler (new infrastructure), the email-sending setup that FEAT-013 hasn't built yet, and choices about recipients, timezone, and failures.

  So neither is a quick add-on to the CSV work.

**Proposed classification**

| Item | Type | Rough size | Depends on |
|---|---|---|---|
| FEAT-015 Export a report as PDF with client logo | New feature | M | FEAT-012 (shares the export path) |
| FEAT-016 Weekly scheduled report email | New feature | L | FEAT-013 (email sending), FEAT-015 if the attachment is the PDF |

**Timeline impact:** about M + L more work in a plan that's already full. Unless something gives, this most likely pushes launch back about a week, or bumps FEAT-014 (the audit log) to after launch. The client needs to pick which.

**Questions that decide the specs**

1. PDF: is it the same content as the CSV, or a formatted layout? Where does the logo come from: one fixed file, or uploaded per client?
2. Weekly email: who gets it (fixed list or chosen by each user)? What day, time and timezone? Is the PDF attached or linked? What happens if the report is empty or sending fails?
3. Trade-off: move the launch date, drop or defer FEAT-014, or schedule these two for after launch?

**What I'll do now:** finish FEAT-012 (the CSV export) as approved. Once you answer, I'll write the Gherkin scenarios and estimates for FEAT-015 and FEAT-016, log the change in `logs/CHANGE-LOG.md` marked SCOPE CHANGE, and bring them back for approval before building anything.
