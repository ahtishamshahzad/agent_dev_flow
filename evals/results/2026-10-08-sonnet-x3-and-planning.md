# Sonnet at 3 runs per arm, and the planning change — 2026-10-08 · judged blind by claude-opus-5-5

> Same method as `2026-10-08-blind-two-models.md`. Raw: `raw/2026-10-08-cases-sonnet/`, `raw/2026-10-08-planning-provisional-{opus,sonnet}/`. **Deviation:** Sonnet runs 2–3 of the AgentFlow arm started after the provisional-proposal change (1.7.0), so its planning rows mix versions.

## claude-sonnet-5-5 — 3 runs per arm

| Case | AgentFlow (mean · runs) | Baseline (mean · runs) | Properties that differ (AgentFlow → baseline) |
|---|---|---|---|
| architecture | 100% | 100% | — |
| bug-fixing | 81% · 6/7, 6/7, 5/7 | 71% · 5/7 ×3 | **P5** regression test first 67% → 0% |
| planning | 67% · 4/7, 6/7, 4/7 | 62% · 4/7, 4/7, 5/7 | P2 ≤5 questions 33% → 100% · **P3** assumptions 100% → 0% · P6 payments as a decision 100% → 33% |
| scope-control | 78% · 5/6, 5/6, 4/6 | 72% · 5/6, 4/6, 4/6 | **P3** concrete impact stated **0% → 67%** · **P6** request recorded 100% → 0% |
| security | 86% | 90% | — |
| testing | 100% | 100% | — |
| **Mean** | **85%** · $0.112 · 6.9 turns · 29 s | **83%** · $0.050 · 2.2 turns · 19 s | |

On Sonnet the two arms are close. AgentFlow's procedural gains hold (regression-first, recording, assumptions); a Sonnet-specific weakness appears: its scope-change replies did not state a concrete timeline impact.

## The provisional-proposal change (1.7.0), AgentFlow arm, planning case

| | Opus — before (3 runs) | Opus — after (3 runs) | Sonnet — before (1 run) | Sonnet — after (3 runs) |
|---|---|---|---|---|
| Score | 5/7, 4/7, 4/7 | **7/7, 6/7, 6/7** | 4/7 | **5/7, 6/7, 6/7** |
| P2 — at most ~5 questions | 2 of 3 | **3 of 3** | 0 of 1 | **3 of 3** |
| P7 — "ends by asking to approve apps + stack" | 0 of 3 | 1 of 3 | 0 of 1 | 0 of 3 |

The proposal now arrives in the first reply and planning scores rose on both models. **P7 still mostly fails by design:** the agent labels the proposal "not yet for approval" because Gate 2 deliberately waits for the answers and the behavior scenarios (the maintainer's decision). The property rewards asking for approval immediately; AgentFlow intentionally defers it. Left as a known, intentional difference rather than rewriting the property.

Judge cost for this file: ~$2.50.
