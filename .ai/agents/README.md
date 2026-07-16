# `.ai/agents/` — Agent Role Definitions (Index)

Role definitions for **multi-agent** runs. Used only when multiple agents are justified (`../system/MULTI_AGENT_RULES.md`); single-agent work does not need these.

## Common roles (defined per project as needed)

| Role | Responsibility |
|------|----------------|
| **Orchestrator** | Drives the workflow, assigns tasks, prevents conflicting edits, integrates and validates. |
| **Implementer** | Executes approved tasks within a disjoint file/module scope. |
| **Reviewer** | Independent code review of another agent's output. |
| **Tester** | Authors/runs tests per `../system/TESTING_SELECTION_RULES.md`. |
| **Security reviewer** | Independent security review per `../system/SECURITY_RULES.md`. |

## Index

_No concrete agent files in Phase 1._ Role files are added when a multi-agent run is set up, under approval.

| Agent file | Role | Skill set | Scope |
|------------|------|-----------|-------|
| _(none yet)_ | — | — | — |

## Conventions (when added)

- Each agent file states its role, allowed file/module scope, assigned skills, and inputs/outputs.
- Scopes must be **disjoint** across concurrently-running agents (no shared files).
- The orchestrator owns conflict resolution and final validation.
