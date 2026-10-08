# Context Pack — <task ID / title>

> Fill-in template for multi-step or multi-agent work (`../system/CONTEXT_MANAGEMENT_RULES.md`, `../skills/context-engineering`). Lists, with reasons — not copied content. `agentflow context suggest "<task>"` drafts a starting set.

```yaml
task:
  id: <TASK-NNN / BUG-NNN>
  type: <feature | bug | refactor | migration | …>
  domain: <area>
  budget: <minimal | small | medium | large>
  level: <1-5 reached>
  escalations:            # each with its trigger
    - level: 3
      trigger: <e.g. "notify() calls queue.publish — queue contract unknown">

shared:                   # identical for every agent on this work
  scenarios: [features/<area>/<file>.feature]
  contracts: [<API / schema / shared types>]
  rules: [GHERKIN_RULES, TECHNOLOGY_GOVERNANCE_RULES, scope]

context:
  required:               # path → why
    - path: <src/…>
      why: <modify | understand behavior | test | compatibility | security>
  optional:
    - path: <…>
      why: <load only if …>
  excluded:               # deliberately not loaded
    - <payments, unrelated UI, …>

technology:               # existing: installed versions; new: verified baseline
  <runtime/framework>: <version — source>

constraints:
  - preserve-existing-architecture
  - no-scope-expansion
  - <…>

ownership:                # multi-agent only
  agent: <A>
  may_modify: [<paths>]
```

**Refresh** when a shared contract or scenario changes: stop affected agents, update `shared`, re-issue packs.
