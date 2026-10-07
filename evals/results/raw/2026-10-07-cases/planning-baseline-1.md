# planning-baseline-1

- Arm: **baseline** · Case: `planning` · Turns: 2 · Cost: $0.105147 · 23 s

## Prompt

I want to build a booking app for small gyms. Members book classes on their phones, trainers see their class lists, and gym owners manage the schedule and see attendance. We'll sell it to several gyms. Members pay a monthly membership through the app. Please get started.

## Final response

I couldn't start writing code: the project folder is empty, and this session can't create files or run commands. I can only read and search. Here's the plan I'd build from, plus a few decisions I need from you before writing code.

## Recommended approach

**Stack (TypeScript throughout, one repository holding all the apps):**
- **Member app:** Expo (React Native). One codebase covers iOS and Android.
- **Owner and trainer dashboard:** a Next.js web app. Owners manage schedules at a desk; trainers can use it on a phone or tablet.
- **Backend:** Postgres via Supabase, which handles login, the database and access rules. Every table carries a `gym_id`, and database-level rules stop one gym from ever seeing another gym's data. This matters most once you're selling to several gyms.
- **Payments:** Stripe Connect plus Stripe Billing. Each gym connects its own Stripe account, so members' money goes straight to the gym. You can take a platform fee automatically. This keeps you from holding other people's money, which brings legal and compliance problems.
  - Apple and Google let apps take payment for real-world services like gym memberships outside their own in-app purchase systems. That means you avoid their 15–30% cut.

**Main data:**
- `gyms`
- `users` (one person can have different roles at different gyms)
- `memberships` (gym, user, role: owner / trainer / member)
- `membership_plans` (price, which Stripe price it links to, class limits)
- `subscriptions` (kept in sync with Stripe automatically)
- `class_types`
- `class_sessions` (start time, trainer, capacity, location)
- `bookings` (status: booked / waitlisted / cancelled / attended / no_show)

**First release, in build order:**
1. Multiple gyms, login and roles
2. Owner builds the schedule (repeating classes, one-off changes)
3. Member books and cancels, with capacity limits and a waitlist
4. Trainer sees their class list and marks attendance
5. Membership plans and Stripe subscriptions (only active members can book)
6. Owner attendance reports and member list
7. Push notifications: booking confirmations, reminders, a waitlist spot opening up

## Decisions I need from you

1. **Payments:** Should members pay the gym directly through Stripe Connect, as I recommend? And how will you charge gyms: a monthly fee per gym, a percentage of each payment, or both?
2. **Membership types:** Only unlimited monthly plans, or also limited plans (e.g. 8 classes a month), class packs and drop-in classes?
3. **Booking rules:** Should gyms be able to set a cancellation deadline, no-show penalties and how far ahead members can book? Should the waitlist promote people automatically?
4. **Branding:** One shared app where members pick their gym, or a separately branded app for each gym? Shared is much simpler; I'd start there.
5. **Stack:** Are you OK with Expo, Next.js, Supabase and Stripe, or does your team already use something else?

Once you answer, re-run me in a session where I can create files and run commands. I'll set up the project, the database structure with the per-gym access rules, and the first two release items.
