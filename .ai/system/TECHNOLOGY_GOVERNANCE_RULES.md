# Technology Governance Rules

How technology, versions, and documentation are chosen — and when they change. `STACK_DECISION_RULES.md` decides **which** technology fits each area; this file decides **which version, which documentation, and whether to change what a project already uses**. Applied by `../skills/technology-governance`.

> **Never "always use the latest version."** New projects use the **latest stable, appropriate** technology, verified against official documentation. Existing projects **keep what works** and change only for a concrete engineering reason.

## 1. New project or existing project?

Decide first — it changes every rule below.

```
New project ── no code yet ──→ research current stable releases → official docs (version-matched)
                               → compatibility across the chain → technology decision → Gate 2
Existing project ── code exists ──→ audit the stack and versions (Gate 1) → use what is there
                               → upgrade only when §4 applies → decision → scope / migration
```

A new application *inside* an existing project (a new mobile app next to an existing API) is new for its own stack choices, and existing for everything it shares — contracts, runtime, CI, conventions.

## 2. New projects — latest stable, verified

**"Latest" means latest *stable*:** a released, production-ready version that is actively maintained, officially documented, and compatible with the rest of the stack. Not alpha, beta, release candidate, canary, experimental, deprecated, or abandoned — unless the user explicitly requires it. If the newest major is experimental and the previous one is the stable line, use the stable line. For runtimes with long-term-support lines (Node.js, Python, Java, …), use the current **LTS** unless a requirement needs otherwise.

**Verify, don't remember.** Version-sensitive decisions — versions, APIs, configuration, CLI commands, install steps, breaking changes, deprecations, build and deploy setup, security configuration — are checked against current authoritative sources, never taken from model memory:

| To find | Check |
|---|---|
| Latest stable version | the package registry (`npm view <pkg> dist-tags`, `pip index versions <pkg>`, …), the project's official releases page |
| Support / end-of-life status | the project's official release or support policy page (e.g. the Node.js release schedule) |
| Peer and engine requirements | `npm view <pkg>@<version> peerDependencies engines`, the official compatibility table |
| How to use it | the official documentation **for that version** |
| What changed | official release notes and migration guides |

A documentation MCP server or web access makes this faster where available (`../mcp/RECOMMENDED_SERVERS.md`). **If verification isn't possible** (offline, no tool access), say so and label each affected version and API "unverified — from memory, check before use". Never present a remembered version as current.

**Check compatibility as a chain**, not item by item: runtime → language → framework → libraries → database and data layer → build tools → testing → deployment target. A framework that requires a newer runtime sets the runtime; a library that doesn't support the chosen framework major means a different library or version.

## 3. Existing projects — keep what works

The existing stack is a **constraint**, recorded in the audit (`../skills/existing-project-audit`): languages, runtimes, frameworks, and major dependencies with their **installed versions** (from lock files, not ranges), build and CI setup, infrastructure, conventions.

- **Use the existing technology** when it can deliver the requirement correctly. A React Native + Expo app gets its new screen in React Native + Expo — not a new framework, state manager, or backend.
- **A newer version existing is not a reason to upgrade.** Report drift as information:

  ```
  Upgrade available:    yes (installed 5.2, latest stable 6.1)
  Upgrade recommended:  no
  Reason:               5.2 is supported, has no known vulnerabilities, and supports the feature
  ```

  For npm projects, `agentflow drift [dir]` produces this report: installed versions from the lock file, latest stable from the registry, advisories that cover the installed version, deprecations, and Node.js end-of-life from the official schedule — with the **smallest safe version** for each advisory, so a patch inside the same major is preferred over a major upgrade. `--fail-on security|eol|any` turns it into a CI gate. Other ecosystems: their audit and outdated tools, reported the same way.
- **Bug fixes** use the existing architecture and technology. "Fix the login bug" does not become "upgrade the auth framework" unless the framework is the root cause.
- **Refactors** restructure code; they do not replace technology unless the refactor's stated goal is that change.
- **Existing projects use the documentation for their installed versions**, not the latest docs.

## 4. When an upgrade or replacement is justified

Change existing technology only for a concrete reason, stated in the decision:

| Trigger | Urgency |
|---|---|
| A known vulnerability that affects how the project uses the dependency | **Critical / High** — escalate through bug intake at P0/P1 **as soon as it is found**, even mid-way through an unrelated task (`PROJECT_MANAGEMENT_RULES.md`); listing it as a note is not escalation; security outranks stability |
| The version is end-of-life or no longer receives security fixes | High |
| A required feature can't be built on the current version | Medium — part of that feature's scope |
| A compatibility requirement (runtime, platform, app-store or OS policy, infrastructure) forces it | Per the deadline it imposes |
| Deprecated and scheduled for removal | Low → High as removal approaches |
| A measured performance problem, a compliance requirement, or a serious limitation | Per impact |

For a vulnerability, take the **smallest version that clears it** — a patch or minor within the installed major when one exists — rather than jumping to the latest major. Before any upgrade, answer: why it's needed, what it solves, the breaking changes, the migration work, the regression risk, and whether it's inside the approved scope. Outside the scope → a separate migration work item (`../skills/migration-planning`) or a `SCOPE CHANGE` — never folded silently into the current task. Behavior the upgrade could affect is protected by Gherkin regression scenarios (`GHERKIN_RULES.md`) — the upgrade itself isn't the behavior; what users rely on is.

**Deprecation report:** deprecated (yes/no) · impact · official replacement · migration urgency (low / medium / high / critical). Recommend a migration task; don't migrate unasked.

## 5. Framework guidance wins over general rules

Use the selected framework's **current official recommendations for the version in use** — its routing, data-fetching, build, and deployment patterns — and avoid patterns its documentation marks as outdated. No rule in this system overrides version-specific official guidance; where they conflict, the official guidance wins and the conflict is reported.

## 6. Recording technology decisions

Meaningful decisions — a new project's baseline, a new framework or major dependency, any upgrade or replacement — get a technology decision (`../templates/TECHNOLOGY_DECISION.md`): technology and exact version, the reason, the official documentation link for that version, how the version was verified and when, alternatives, compatibility, risks, and migration needed. Trivial dependencies don't need one. New-project baselines go to Gate 2 with the stack (`QUALITY_GATES.md`).

## Related

`STACK_DECISION_RULES.md` (what to choose) · `QUALITY_GATES.md` (Gates 1, 2) · `GHERKIN_RULES.md` (protecting behavior through upgrades) · `../skills/dependency-audit` · `../skills/security/dependency-security` · `../skills/migration-planning`.
