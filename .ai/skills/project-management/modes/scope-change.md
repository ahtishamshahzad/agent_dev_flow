# Mode: new work mid-project — scope change

Part of `../SKILL.md`. Rules: `../../../system/PROJECT_MANAGEMENT_RULES.md` §Scope changes.

```
approved scope → implementation → new request → classify → impact (effort, dates, risk)
   → SCOPE CHANGE? ── no ──→ schedule it
                   └─ yes ─→ show impact → user approval (Gate 4) → schedule it
```

1. Classify the addition: existing scope · bug · change request · new feature · technical debt · enhancement.
2. Bug → `bug-intake.md`. Existing scope → track it in the current plan.
3. Otherwise: create tasks, estimate, prioritize, map dependencies, assign a phase and week, and record it in `logs/CHANGE-LOG.md` with the timeline impact.
4. If it changes what Gate 4 approved — new capability, displaced commitments, or moved dates — flag **`SCOPE CHANGE`**, show the impact (effort, which work moves, which dates move, new risks), and wait for approval before scheduling it. Never fold it into a current task.
