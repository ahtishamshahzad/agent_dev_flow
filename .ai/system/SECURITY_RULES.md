# Security Rules

Security is a mandatory concern at planning, implementation, and review. It is a gate (`QUALITY_GATES.md` gate 6), not optional polish. These rules are tool-neutral.

## Baseline expectations (every project)

- **Secrets** never hardcoded; server-side env only. `.env` git-ignored; a placeholder `.env.example` committed. Never print a discovered secret's value — report location + type, redacted, and flag for rotation.
- **Authentication** enforced on every protected route; tokens verified, expiring, algorithm-pinned; no default/hardcoded admin credentials; rate-limited auth endpoints.
- **Authorization / IDOR** — every ID-taking endpoint verifies ownership server-side; roles checked server-side; multi-tenant queries scoped by tenant.
- **Input handling** — parameterized queries (no string-concat SQL/NoSQL), output escaping/sanitization (XSS), validated request bodies, hardened file uploads.
- **PII** — minimized in logs and third-party payloads; deletion/anonymization path where required.
- **Transport & errors** — TLS enforced; restrictive CORS; security headers; generic client errors (no stack traces/DB details) with server-side detail.
- **Payments** (if any) — server-side price/total calculation, webhook signature verification, server-verified access gating, abuse vectors closed.
- **Production hardening** — no debug/test endpoints in prod; fail-fast on missing critical env vars; dependency advisories reviewed.

## Behavior during security work

- **Confirmed vs Potential.** Separate what you verified from what you suspect. Assign severity (Critical/High/Medium/Low).
- **Never claim "secure."** Report what was checked and fixed, and what needs human review.
- **Do no harm.** Don't exfiltrate data, hit production/third-party systems, run destructive commands, or weaken existing controls to "make it work."
- **Recommend human review** for apps handling real money or sensitive PII at scale.

## Where it plugs in

- **Planning:** security needs feed application/phase generation (`APPLICATION_SELECTION_RULES.md`, `PHASE_GENERATION_RULES.md`).
- **Implementation:** apply the baseline above; use relevant security skills (`SKILL_SELECTION_RULES.md`).
- **Review:** the security gate uses `../checklists/` and any security skill. Hooks like `before-commit`/`before-pr`/`before-release` (`HOOK_RULES.md`) run security checks.
- **MCP/tools:** follow `../mcp/PERMISSION_RULES.md` — least privilege, explicit enablement.

## Non-negotiable

Token or time pressure never justifies skipping a security check. If a check can't be run here, provide the command and mark it **"unverified until run."**
