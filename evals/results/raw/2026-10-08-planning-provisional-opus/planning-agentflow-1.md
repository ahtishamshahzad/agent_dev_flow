# planning-agentflow-1

- Arm: **agentflow** · Case: `planning` · Turns: 16 · Cost: $0.4567834 · 105 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

I want to build a booking app for small gyms. Members book classes on their phones, trainers see their class lists, and gym owners manage the schedule and see attendance. We'll sell it to several gyms. Members pay a monthly membership through the app. Please get started.

## Final response

I've started planning your gym booking app. I haven't written any code, installed anything or chosen a stack yet. The project's rules require two sign-offs from you first: one on the behavior, apps and stack, and one on the phases and tasks.

**Couldn't save the record:** file writing is disabled in this session, so I couldn't create `.ai/projects/current/CURRENT_STATUS.md`. The request, requirements and open questions below are only in this chat for now. I'll write the file once writing is enabled.

## Where things stand
- **Type of project:** a new project, sold to several gyms (each gym's data kept separate) and with recurring payments.
- **Existing code:** none. The folder holds only `.ai/`, `AGENTS.md` and `CLAUDE.md`.
- **Next step:** I need your answers to the questions below. Then I'll write the behavior scenarios (Gherkin) and bring them to you with the apps and stack for your approval.

## Questions that affect the design

1. **Who gets the money?** Do members pay each gym directly, with you taking a fee or charging gyms a monthly subscription? Or do you collect everything and pay the gyms? The first is simpler and safer for you. The second makes you legally responsible for every payment.
2. **What can members buy?** Only an unlimited monthly membership, or also class packs, drop-ins or tiers? If a monthly payment fails, can the member still book?
3. **What are the booking rules?** Is there a waitlist? How late can a member cancel, and what happens on a no-show? How is attendance recorded: trainer check-in, a QR code at the door, or something else?
4. **How is the app distributed?** One app for all gyms, where members pick their gym? Or a separately branded app per gym? Is it iOS and Android? Do trainers use phones, and owners a computer?
5. **Which countries are you launching in, and when?** This sets currency, tax, payment rules and data-protection law. Do you have a first gym lined up?

## Provisional proposal (not yet for approval)

This assumes members pay their gym, one shared app, trainers on phones and owners on a computer.

| App | Decision | Why |
|---|---|---|
| Mobile app (members + trainers) | ✅ Select | Members book on phones. Trainers get a view of their classes in the same app, so there's one app to ship. |
| Owner dashboard (web) | ✅ Select | Managing schedules and reading attendance reports works better on a computer. It's kept separate from the member app. |
| Backend API | ✅ Select | Booking rules, class capacity, separating gyms' data, and payment notifications have to be enforced on a server. |
| Database | ✅ Select | Gyms, members, classes, bookings and memberships are related data. |
| Background jobs | ✅ Select, kept small | Handles payment notifications, failed-payment follow-up, reminders and moving people off the waitlist. |
| Real-time updates, file storage, marketing site, shared code packages | ⏸ Defer | Each waits until a feature needs it: live seat counts, gym logos, selling to gyms, or a second app that shares code. |
| Member web app | ❌ Exclude | You said members book on their phones. |

**Likely stack:** Expo (React Native), Next.js, NestJS, PostgreSQL with Prisma, and Stripe Billing + Connect for payments. Testing would use Jest/Vitest, Playwright and Maestro.

Version numbers aren't decided yet. Per the rules, I'll check each against official docs before you approve, not quote them from memory. Alternatives I'll present at the same time: Vite + React for the dashboard, Express for the backend, and Drizzle instead of Prisma.

**How your answers change this:**
- If you collect all payments yourself, the payment setup changes and compliance work increases.
- A separately branded app per gym adds a build per gym.
- Class packs or tiers make the billing logic more complex.
- If trainers work on computers rather than phones, the trainer view moves into the dashboard.

**Unverified assumption about app stores:** Apple and Google normally require their own in-app purchase for digital goods. Gym memberships are a real-world service, so I expect you can use outside payments like Stripe instead. That would save the stores' commission. I haven't checked this against their current policies yet, and I will before you approve anything.

## After you answer
I'll write the behavior scenarios for:
- **Booking:** booking, cancelling, full classes and waitlists.
- **Gym and roles:** keeping each gym's data separate and who can do what.
- **Payments:** membership signup, renewal and failed payments.
- **Schedule and attendance:** trainer class lists, schedule management and attendance.

I'll bring those to you with the final app and stack recommendation for approval. Architecture, phases and tasks come after that.
