# planning-baseline-2

- Arm: **baseline** · Case: `planning` · Turns: 2 · Cost: $0.1082766 · 26 s
- Project files (besides installed `.ai/`): none

## Prompt

I want to build a booking app for small gyms. Members book classes on their phones, trainers see their class lists, and gym owners manage the schedule and see attendance. We'll sell it to several gyms. Members pay a monthly membership through the app. Please get started.

## Final response

I checked the working directory and it's empty. I also can't create files in this session: I only have read and search tools, with no way to write files or run commands. So I can't scaffold the project yet. What I can do is settle the decisions that are hardest to change later. Here's what I recommend, plus a few questions only you can answer.

## Decisions to make up front

**1. Selling to several gyms: one shared platform, one app**
- Run one backend and one database, and tag every record with the gym it belongs to. The database itself should stop one gym from ever seeing another gym's data, rather than relying on the app code to remember.
- Publish one app in the stores. Members choose their gym or enter an invite code. Avoid a separately branded app per gym: Apple usually rejects near-identical template apps unless each gym submits its own, and it multiplies your release work.

**2. Payments: Stripe Connect, not Apple/Google in-app purchase**
- A gym membership is a service used in the real world, so Apple and Google allow you to take payment outside their in-app purchase systems and skip their 15–30% cut.
- Each gym connects its own Stripe account. Members' money goes straight to the gym, and your platform can take a fee automatically. That keeps you from holding other businesses' money, which brings legal and payout headaches.
- Stripe notifies your backend when a payment succeeds or fails, and the app uses that to decide whether a member can book. An unpaid member can't book.

**3. Stack** (aimed at a small team shipping quickly)
- **Member and trainer app:** React Native with Expo, so one codebase covers iOS and Android. Trainers sign into the same app and see a different view based on their role.
- **Owner dashboard:** a web app (Next.js). Building schedules and reading attendance reports is much easier on a laptop than a phone.
- **Backend:** Supabase. It gives you a Postgres database, logins, and the per-gym data isolation from point 1 out of the box, which saves a lot of building. A custom Node + Postgres backend also works if you'd rather not depend on a vendor.

**4. Booking rules to design properly from day one**
- **Capacity:** the check must hold up when two people grab the last spot at the same moment, so a class is never overbooked.
- **Waitlist:** when someone cancels, the next person moves up automatically and gets a push notification.
- **Cancellation window and no-shows:** each gym sets its own rules, for example no cancelling within 2 hours of class.
- **Recurring classes:** owners define a weekly template (say, Monday 6pm HIIT) and the app generates individual sessions from it.
- **Attendance:** trainers check members in from their class list. Owners' reports are built from those check-ins.

## Suggested first version
1. Gym signup and Stripe onboarding for owners
2. Owner builds the class schedule and invites trainers
3. Member signs up, picks a monthly plan, and pays
4. Member books or cancels a class, with capacity and a waitlist
5. Trainer sees the class list and checks members in
6. Owner sees attendance and active members

I'd hold class packs, drop-ins, discount codes, family accounts and chat until later.

## Questions for you
1. **Country and currency?** This affects tax, Stripe availability and privacy law (GDPR, for example).
2. **Membership types:** monthly unlimited only, or also limited plans (say 8 classes a month), class packs or drop-in passes?
3. **How you earn:** a monthly subscription per gym, a percentage of each payment, or both?
4. **Any stack preferences or existing skills**, and who will maintain the code?
5. **What should "get started" produce first:** a written specification and data model, or working code?

If you give me a session where I can write files and run commands, I'd start with the database design and per-gym data isolation, since everything else builds on them. Then I'd build the booking flow end to end.
