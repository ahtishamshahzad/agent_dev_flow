# Stack Decision Rules

Recommend a technology stack **per area**, with justification, only after applications are selected — and only the areas the selected applications actually require. The user approves the stack before any code (`QUALITY_GATES.md` gate 2).

> **This system does not pre-select a stack.** The options below are the decision space to evaluate, not defaults.

## Golden rule: pair correctly, don't mis-compare

- A **database** is storage. A **data layer / ORM** is how code talks to it. They are chosen **together**, not compared against each other.

**Correct pairings (examples):**
- PostgreSQL + Prisma
- MySQL + Drizzle
- MongoDB + Mongoose

**Incorrect comparison:**
- ❌ "Prisma versus MongoDB" — these are different layers. Never frame a choice this way.

## Decision areas

Evaluate only those relevant to the selected applications.

### Mobile
- **Runtime:** Expo · React Native CLI
- **Navigation:** Expo Router · React Navigation
- **State:** local state · Context · Redux Toolkit · Zustand · server-state tools
- **API/data fetching:** fetch · Axios · RTK Query · TanStack Query

### Web
- Next.js · Vite + React

### Backend
- Express · NestJS · another justified option

### Database
- PostgreSQL · MySQL · MongoDB

### Data layer (paired with the database)
- Prisma · Drizzle · Mongoose · native driver

### Testing
- Jest · Vitest · Supertest · Playwright · Maestro · React Native Testing Library
- (See `TESTING_SELECTION_RULES.md` for how to choose per application and level.)

## How to recommend

For each required area:
1. State the **need** the choice must satisfy (scale, team familiarity, ecosystem, constraints).
2. Give a **recommendation** with 1–3 sentence justification.
3. Note **credible alternatives** and why they were not chosen.
4. Flag **lock-in / migration risk** where relevant.

Keep recommendations proportional — a small feature does not need a full stack essay.

## Cross-area consistency

- Prefer choices that share an ecosystem across applications when it reduces cost (e.g. one testing runner where sensible), but do not force a poor fit for the sake of uniformity.
- Ensure the data layer matches the database engine (relational ORM for relational DB; document ODM for document DB).

## Output of this stage

For the approval gate, produce a **stack recommendation table**: area → recommendation → justification → alternatives considered. Record the approved stack in `../projects/current/`. Do **not** install dependencies at this stage — installation happens during implementation, after approval.
