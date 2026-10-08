# New project — external documentation is the context

> **Status: PROPOSED.** Fictional.

**Request:** "Start a Next.js app with PostgreSQL through Prisma." **Budget:** medium.

There is no repository to read, so most of the context is **Level 5**, by design (`TECHNOLOGY_GOVERNANCE_RULES.md`):

| Loaded | Why |
|---|---|
| Global rules, `technology-governance`, `stack-recommendation` | how to choose versions |
| `npm view next dist-tags`, `npm view prisma dist-tags` | latest **stable** (a pre-release `latest` tag is skipped) |
| The Node.js release schedule | LTS line |
| `npm view next@<v> engines peerDependencies`, Prisma's supported-versions page | compatibility chain |
| The official docs **for the chosen majors** — getting started and configuration pages only | setup that matches the versions |

**Not loaded:** whole documentation sites, tutorials, blog posts, docs for other majors. The baseline goes to Gate 2 with sources and dates; what couldn't be verified is labelled.
