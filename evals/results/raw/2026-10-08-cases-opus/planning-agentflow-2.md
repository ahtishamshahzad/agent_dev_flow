# planning-agentflow-2

- Arm: **agentflow** · Case: `planning` · Turns: 24 · Cost: $0.5246516 · 89 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

I want to build a booking app for small gyms. Members book classes on their phones, trainers see their class lists, and gym owners manage the schedule and see attendance. We'll sell it to several gyms. Members pay a monthly membership through the app. Please get started.

## Final response

I've started on the plan, but I couldn't save the planning files: file writing is turned off in this session. The intended files were `REQUIREMENTS.md`, `DISCOVERY_QUESTIONS.md` and `CURRENT_STATUS.md` in `.ai/projects/current/`. The content is below so nothing is lost, and I can save it once writing is enabled. No code, installs or tech choices yet; the project's rules require your approval before those.

## Where we are
- **Request type:** new project. There's no existing code: I searched for package files, lock files, source files and `.feature` files and found none outside `.ai/`.
- **Stage:** working out the requirements. Five open questions change the plan, so I'm asking before I write the behavior scenarios (Gherkin) or pick apps and a tech stack.

## Draft requirements
**Who uses it:** members, trainers, gym owners, and you as the platform operator who signs up gyms.

**Must have:**
- Members sign up and are linked to their gym.
- Members browse the schedule, then book or cancel. Full classes refuse new bookings.
- Members pay a monthly membership in the app, and only members with an active membership can book.
- Trainers see their classes and who's booked, and mark attendance.
- Owners create and edit classes, both one-off and weekly repeating. When a class is cancelled, its booked members get a message.
- Owners manage trainers and membership plans, and see attendance by class, member or date range.
- Many gyms share one system, and no gym can see another gym's data.
- You can add a new gym without developer work.

**Should have:** reminder messages. **Could have:** waitlists.

**Other requirements:**
- Gym data separation is enforced on the server, not just hidden in the screens.
- Card details go only to the payment provider, never through our servers.
- No overbooking when several people grab the last spot at once.
- Class times are right in each gym's time zone, including clock changes.
- Personal data is protected.
- Assumed size: up to about 50 gyms with up to 1,000 members each.

**Success targets (please confirm):**
- A first-time member can join and book in under 2 minutes.
- No overbookings and no data leaks between gyms in testing.
- An owner can publish a week's schedule in under 15 minutes.

## Assumptions (tell me if any are wrong)
1. Each member and each trainer belongs to one gym, and each gym has one location.
2. Memberships are monthly only: no class packs, drop-ins or trials.
3. Trainers mark attendance; members don't check themselves in with QR codes.
4. Each gym sets its own cancellation cut-off (default 2 hours), with no late-cancel fees in v1.
5. Messages go by email in v1; phone notifications only if we build store apps.
6. You add new gyms yourself; gyms can't sign themselves up.
7. No chat, marketing tools or workout tracking.

## Questions I need answered
1. **Which countries and currency will your first gyms be in?** This decides which payment providers work there, sales tax/VAT, card security checks and privacy law.
2. **Where does membership money go?**
   - (a) Straight to each gym's own account, with you optionally taking a fee.
   - (b) To you, and you pay the gyms.

   Also, how do gyms pay you: a subscription, a fee per member, or a cut of payments? This sets who handles refunds and disputes, and it's the hardest choice to change later.
3. **What does "on their phones" mean?**
   - (a) Real apps in the App Store and Google Play.
   - (b) A mobile website members can add to their home screen.
   - (c) The website first, store apps later.

   This is the biggest driver of cost and timeline.
4. **Branding:** one shared app where members pick their gym, or a branded app or web address per gym?
5. **Who will build and maintain this?** Any deadline, budget, or languages your team already knows?

Once you answer, I'll write the behavior scenarios and recommend which apps to build and the tech stack, with current versions checked against official sources. Then I'll stop for your approval before any design or code.
