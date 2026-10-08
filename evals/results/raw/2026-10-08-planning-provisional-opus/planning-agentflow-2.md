# planning-agentflow-2

- Arm: **agentflow** · Case: `planning` · Turns: 15 · Cost: $0.4238948 · 65 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

I want to build a booking app for small gyms. Members book classes on their phones, trainers see their class lists, and gym owners manage the schedule and see attendance. We'll sell it to several gyms. Members pay a monthly membership through the app. Please get started.

## Final response

I've started this as a **new project**. I checked the folder first: the only files outside `.ai/` are `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md` and `USAGE.md`. There's no existing code, so this is a fresh build.

The project rules say nothing gets coded, installed or locked in until you've approved the plan. So this step is about understanding what you need. Below are the questions that change the design most, and a draft plan you can react to while you answer.

## Requirements as I understand them

- **Three kinds of users:** members (book classes on their phone, pay a monthly membership), trainers (see who's booked into their classes) and gym owners (manage the schedule, see attendance).
- **Several gyms on one system.** Each gym's data must be kept strictly separate from the others. This is the most important rule in the whole design.
- **Payments:** recurring monthly memberships, paid inside the app.
- **Mostly phone-based** for members and trainers.

## Questions that block the plan (most important first)

1. **Where does membership money go?** Does each gym get paid directly into its own account, with you taking a fee or charging a subscription? Or do you collect everything and pay the gyms out? This decides the payment setup and your legal and tax exposure.
2. **One app or a branded app per gym?** Either one app on the App Store and Google Play where members pick their gym, or a separately branded app for each gym. Branded apps cost a lot more to build and maintain.
3. **What are the booking rules?** Class size limits? A waitlist? A cancellation cutoff (e.g. no cancelling within 2 hours of class)? Can a membership cap classes (e.g. 8 a month), or is it always unlimited? Are one-off drop-in payments allowed?
4. **How is attendance recorded?** Does the trainer mark who showed up, do members check in themselves (e.g. scanning a QR code at the gym), or does a booking simply count as attendance?
5. **Which country, currency and launch size?** This affects tax on payments, privacy law (e.g. GDPR in the EU) and how much to build up front. It also helps to know your timeline and how many people are building it.

## Draft plan (not yet for approval)

This assumes: one shared app, each gym paid directly, trainer- or check-in-based attendance, one country at launch.

**What to build**

| Part | Decision | Why |
|---|---|---|
| Mobile app (iOS + Android) | **Build** | Members book and pay on their phones. Trainers use the **same app** with a trainer view, since they mainly need a class list. |
| Gym owner dashboard (web) | **Build** | Managing schedules and reading attendance is easier on a computer. It's kept separate from the member app for security. |
| Server (backend) | **Build** | Handles booking rules, separating each gym's data, and payment updates from the payment provider. |
| Database | **Build** | Stores gyms, classes, bookings and memberships. These are closely linked records, and the database must stop two people taking the last spot at the same moment. |
| Background jobs | Later | Add when we need reminders or automatic waitlist moves. |
| Push notifications | Later | Add with class reminders and waitlist alerts. |
| Website to sell to gyms | Later | Useful once you're actively selling to gyms. |
| Member website | Not now | Members use the phone app. |
| File storage | Later | Add when gyms upload logos or trainer photos. |

**Suggested technology**

| Area | Suggestion | Main alternative and why not |
|---|---|---|
| Mobile | Expo (React Native) + Expo Router + TanStack Query | Plain React Native: more setup work for little benefit here. |
| Owner dashboard | Vite + React | Next.js: its strengths (search visibility, server rendering) don't matter for a login-only dashboard. |
| Server | NestJS (TypeScript) | Express: NestJS gives more built-in structure for per-gym access checks. |
| Database | PostgreSQL + Prisma | MongoDB: weaker at keeping linked booking and payment records consistent. |
| Payments | Stripe for subscriptions, plus Stripe Connect (each gym gets its own account) | Building our own: far more risk and compliance work. Card details never touch our servers. |
| Login | Open: a hosted login service vs. building our own | I'll recommend one after your answers. |
| Testing | Jest/Vitest, Supertest, Playwright (dashboard), Maestro (mobile) | One language (TypeScript) across all parts. |

**How your answers change this**

- **If you collect the money and pay gyms out:** the payment setup changes, and you take on more legal and tax responsibility.
- **If each gym wants its own branded app:** the mobile build and release work grows a lot.
- **If members check in by QR code:** we add a check-in screen and a way to stop fake check-ins.
- **If membership plans cap classes:** we need credit tracking and the background-jobs part sooner.

**Two things I haven't verified yet:**
- **Version numbers:** none of the versions above are confirmed. I'll check them against official sources before you approve anything.
- **App store rules:** I believe Apple and Google let gym memberships be paid outside their in-app purchase systems, because the service is used in person. I'll confirm that against the current store rules, since it affects your margins.

## Next steps

1. You answer the questions above.
2. I write the expected behavior as concrete examples (Gherkin scenarios): booking, a full class, the waitlist, cancelling late, failed payments, a trainer viewing their class list, and one gym trying to see another gym's data.
3. I finalise which parts to build and the technology, with verified versions.
4. **You approve.** Only then do I move on to design and the build plan.

**Couldn't save yet:** I meant to write this into `.ai/projects/current/CURRENT_STATUS.md` as the project record, but I can't edit files in this session. I'll create it once file editing is available, or you can paste this in.
