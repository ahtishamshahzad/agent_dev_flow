# planning-baseline-1

- Arm: **baseline** · Case: `planning` · Turns: 2 · Cost: $0.10170860000000001 · 21 s
- Project files (besides installed `.ai/`): none

## Prompt

I want to build a booking app for small gyms. Members book classes on their phones, trainers see their class lists, and gym owners manage the schedule and see attendance. We'll sell it to several gyms. Members pay a monthly membership through the app. Please get started.

## Final response

The project folder is empty, and this session can't create files: I only have read and search tools here, with no write or shell access. So I've started with the plan and the decisions that shape the code. Once you've answered the questions below, run me in a session that has file and terminal access and I'll set up the project and build the first piece.

## Recommended approach

**Architecture**
- **One app for all gyms.** The data is shared, but every record is tagged with the gym it belongs to, and the database itself blocks one gym from seeing another gym's data. This needs to be in place from the start because adding it later means rewriting a lot.
- **Members and trainers:** one phone app for iOS and Android, built with React Native (Expo). The screens each person sees depend on their role.
- **Gym owners:** a web dashboard (Next.js). Managing schedules and reading attendance reports is easier on a laptop.
- **Backend:** Postgres via Supabase, which also handles logins and the data-isolation rules between gyms. A small server would handle payments and other logic that can't run on the phone.

**Payments: Stripe Connect**
- Each gym connects its own Stripe account, so membership money goes straight to the gym. You can take a platform fee automatically, which is also an easy way to charge gyms for the software.
- Stripe Billing handles the monthly subscriptions, failed-card retries and the receipts members manage themselves.
- **App Store rules:** gym memberships count as real-world services, so Apple and Google let you charge through Stripe. You don't have to use their in-app purchase system or pay their 15–30% cut. Worth knowing now, since it affects your pricing.

**Core data:** gyms, users (a person can have different roles at different gyms), membership plans, memberships (linked to the Stripe subscription), class types, scheduled classes (with trainer and capacity), bookings and attendance.

**Build order (each step is usable on its own)**
1. Gym setup, sign-up and login with roles, and the owner creating classes and repeating schedules
2. Members booking and cancelling, capacity limits, and trainers seeing their class lists and checking people in
3. Stripe Connect setup for each gym, membership plans and subscriptions, with booking only for members who have paid
4. Attendance reports, notifications (reminders and cancellations), waitlists
5. Inviting new gyms and charging them for the software

## Questions that change the design
1. **Branding:** should there be one shared app where members pick their gym, or a separately branded app for each gym? A shared app is far cheaper to run; branded apps are something gyms often ask for.
2. **What a membership covers:** unlimited classes only, or also class packs, drop-in visits and different membership levels?
3. **Booking rules:** do you need waitlists, cancellation cut-offs or no-show penalties in the first version?
4. **Charging gyms:** a monthly fee per gym, a percentage of member payments, or both?
5. **Countries:** this affects tax handling and which payment methods are available.
6. **Tech:** do you or your team already know a stack? If so, I'll fit the plan to it rather than to my defaults.

If you're happy with these defaults, just answer 1–4 and I'll start on step 1 once I have file access.
