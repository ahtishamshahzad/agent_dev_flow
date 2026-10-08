# planning-agentflow-3

- Arm: **agentflow** · Case: `planning` · Turns: 10 · Cost: $0.15938739999999998 · 35 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

I want to build a booking app for small gyms. Members book classes on their phones, trainers see their class lists, and gym owners manage the schedule and see attendance. We'll sell it to several gyms. Members pay a monthly membership through the app. Please get started.

## Final response

I've classified this as a **new project** and I'm at the "missing questions" step. I haven't written any code, picked a stack, or installed anything. The repo is greenfield: I searched it and found only the `.ai/` governance files, `AGENTS.md` and `CLAUDE.md`. I also couldn't save `CURRENT_STATUS.md` because the Write tool is disabled in this session, so nothing is recorded in `.ai/projects/current/` yet.

## Questions that block the plan

1. **Payments and how you earn money.** Does each gym get paid directly (Stripe Connect or similar, with you taking a platform fee), or do you collect everything and pay gyms out? Do you charge gyms a SaaS fee on top? This decides the payments design and your compliance burden.
2. **Membership model.** Is it one flat monthly price per gym, or several tiers? Do tiers limit classes per month, or is it unlimited? Are there drop-in or class-pack options, or only monthly?
3. **Booking rules.** What should happen for these?
   - Class capacity and waitlists.
   - Cancellation cutoff.
   - Late cancels and no-shows.
   - Whether a lapsed or unpaid membership blocks booking.
4. **Trainer and owner surfaces.** Should trainers and owners use the phone app too, or is a web dashboard acceptable for owners (schedule editing and attendance reports are much easier on a larger screen)? Do owners need to see across several locations?
5. **Platform, region and branding.**
   - Do you need iOS and Android, or just one first?
   - Which countries and currencies?
   - Do gyms need their own branded app in the stores, or is one shared app where members pick their gym enough? This has a large effect on cost and App Store handling.

## Provisional proposal (not the Gate 2 decision)

This is what I'd propose if you answer roughly "one shared app, direct payouts to gyms, web dashboard for owners":

| Candidate | Provisional call | Why |
|---|---|---|
| Mobile app | **Select** (cross-platform) | Members book on phones. |
| Backend API | **Select** | Multi-tenant rules, roles, bookings and payment webhooks need a server. |
| Database | **Select** (relational) | Bookings, capacity and attendance need transactional integrity. |
| Admin dashboard (web) | **Select** | Owners and trainers manage schedules and read reports. It stays separate from any public site. |
| Background worker | **Select** | Needed for payment webhooks, renewals, and reminders and waitlist promotion. |
| Payments provider | **Select** (a provider with marketplace support) | Recurring billing across several gyms. |
| Real-time service | Deferred | Add only if live roster updates become a requirement. |
| Marketing site, public member web app | Deferred or excluded | Neither is needed for a first release. |
| File storage | Deferred | Needed only if you add profile photos or class images. |

**How your answers would change it:**
- If each gym needs its own branded store app, the mobile plan changes a lot.
- If owners must work from their phones, the web dashboard may shrink or move to a later phase.
- If you collect all the money yourself, the payments design and compliance work grow.

Stack and versions will come only after your answers. Version choices will be checked against current official docs rather than my memory.

## After you answer

I'll write the Gherkin scenarios for the core behaviors:
- Booking, cancelling and the waitlist.
- Membership payment, failure and lapse.
- Role-based access.
- **Tenant isolation**, so one gym can never see another's data.
- Attendance.

Then I'll present them with the final applications and stack for your approval (Gate 2). No architecture or code comes before that approval.
