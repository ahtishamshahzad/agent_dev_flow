# planning-baseline-1

- Arm: **baseline** · Case: `planning` · Turns: 2 · Cost: $0.049343399999999996 · 15 s
- Project files (besides installed `.ai/`): none

## Prompt

I want to build a booking app for small gyms. Members book classes on their phones, trainers see their class lists, and gym owners manage the schedule and see attendance. We'll sell it to several gyms. Members pay a monthly membership through the app. Please get started.

## Final response

I can't create files in this session. I only have read and search tools, and the project folder is empty. So I've written a proposed starting plan and a few questions that change the design. Once you've answered them, I can scaffold the project if write access is available.

## Proposed stack (my recommendation)

| Layer | Choice | Why |
|---|---|---|
| Mobile (members, trainers) | React Native + Expo, TypeScript | One codebase for iOS and Android, with push notifications built in |
| Owner dashboard | Next.js web app | Owners manage schedules and read attendance on a desktop |
| Backend | Node/TypeScript API (Fastify or NestJS) | Shares types with both clients |
| Database | Postgres | Booking logic needs transactions and constraints |
| Payments | Stripe Billing + Stripe Connect | Each gym gets paid directly, and you can take a platform fee |
| Auth | Email/password or magic link, with roles | Roles are member, trainer and owner |

## Core design decisions

- **Multi-tenancy:** every table carries a `gym_id`, and every query is scoped to it. Postgres row-level security enforces this, so one gym can never see another's data.
- **Core entities:** Gym, User, Membership (a user's role and plan at a gym), Plan, ClassTemplate (recurring), ClassSession (one occurrence), Booking, Attendance, Subscription.
- **Booking rules:**
  - Capacity is enforced in a transaction, so two people can't take the last spot.
  - There is a waitlist with auto-promotion.
  - Cancellations close at a cutoff time.
  - Optionally, a plan can limit how many classes a member can book per month.
- **Payments:** a member subscribes to a gym's plan through Stripe Checkout. Stripe webhooks update the membership status, and a failed payment blocks new bookings.

## Phased build

1. **Foundation:** repo layout, database schema, auth, roles and tenant isolation.
2. **Scheduling and booking:** class templates, sessions, booking, cancellation, waitlist.
3. **Trainer and owner views:** class lists, check-in, attendance reports.
4. **Payments:** Stripe Connect onboarding for gyms, member subscriptions, webhooks.
5. **Polish:** push reminders, gym branding, onboarding a new gym.

## Questions that change the design

1. **Payments:** should the money go straight to each gym (Stripe Connect), or through your account with you paying gyms out? Connect is simpler for compliance. Do you also want to take a fee per gym or per member?
2. **Membership model:** is it one flat monthly plan per gym, or several tiers (for example unlimited vs. 8 classes a month)? Do you need drop-in or class-pack purchases?
3. **Branding:** one shared app where members pick their gym, or a white-labeled app per gym? A shared app is far cheaper to build and maintain.
4. **Region and currency:** where are the gyms? This affects Stripe availability, tax and currencies.
5. **Team and timeline:** are you building this solo, and do you have a target launch date? That decides whether to shrink the first version to a minimum.

Please answer these, or just say "go with your defaults." My defaults would be Stripe Connect, tiered plans, a shared app, and the phased plan above. I'd start with phase 1.
