# Blind evaluation — 2026-10-08 · Claude Code 2.1.292 · two models · judge claude-opus-5-5

> **Scored blind by a separate model** (`evals/score.js`): no arm label, AgentFlow-identifying text masked. Masking hides the label, not the style — an AgentFlow answer still tends to stop for approval — so the judge could sometimes infer the arm. Still small: 3 runs per arm on Opus, 1 on Sonnet. Regenerate the tables with `node evals/summarize.js` over the three raw folders below.

- **Transcripts:** `raw/2026-10-07-cases/` (pilot, run 1 — AgentFlow 1.4.0), `raw/2026-10-08-cases-opus/` (runs 2–3 — AgentFlow 1.5.0→1.6.0 working copy), `raw/2026-10-08-cases-sonnet/` (AgentFlow 1.6.0). Every transcript has a `.score.json` with a quote per property.
- **Deviations:** read-only tools in every run; AgentFlow changed between the pilot and the later runs (Gherkin and technology rules), and wording in the audit and operating rules changed while the Opus batch was running.

## claude-opus-5-5 — 3 runs per arm

| Case | AgentFlow (mean · runs) | Baseline (mean · runs) | Properties that differ (AgentFlow → baseline) |
|---|---|---|---|
| architecture | 95% · 7/7, 7/7, 6/7 | 100% · 7/7, 7/7, 7/7 | — |
| bug-fixing | 95% · 7/7, 7/7, 6/7 | 71% · 5/7, 5/7, 5/7 | **P5** regression test first 100% → 0% · **P6** severity 67% → 0% |
| planning | 62% · 5/7, 4/7, 4/7 | 71% · 5/7, 5/7, 5/7 | **P3** assumptions listed 100% → 0% · **P7** asks to approve apps + stack **0% → 67%** |
| scope-control | 94% · 6/6, 6/6, 5/6 | 83% · 5/6, 5/6, 5/6 | **P6** request recorded 100% → 0% |
| security | 90% · 7/7, 6/7, 6/7 | 81% · 6/7, 6/7, 5/7 | — |
| testing | 100% · 7/7 ×3 | 90% · 6/7, 7/7, 6/7 | **P6** test level named 100% → 33% |

| Arm | Runs | Mean pass rate | Mean cost | Mean turns | Mean time |
|---|---|---|---|---|---|
| AgentFlow | 18 | **90%** | $0.287 | 10.7 | 49 s |
| Baseline | 18 | **83%** | $0.101 | 2.0 | 25 s |

## claude-sonnet-5-5 — 1 run per arm

| Case | AgentFlow | Baseline | Properties that differ |
|---|---|---|---|
| architecture | 7/7 | 7/7 | — |
| bug-fixing | 6/7 | 5/7 | **P5** regression test first |
| planning | 4/7 | 4/7 | AF: P3 assumptions ✓, P2 ✗ (more than ~5 questions) · baseline the reverse |
| scope-control | 5/6 | 5/6 | AF: P6 recorded ✓, P3 impact ✗ · baseline the reverse |
| security | 5/7 | 6/7 | AF ✗ P5 (findings not located/rated) |
| testing | 7/7 | 7/7 | — |
| **Mean** | **83%** ($0.126) | **83%** ($0.049) | |

## What the blind scores say

- **Consistent AgentFlow gains, both models:** writing the regression test/scenario first on a bug (P5: AgentFlow every run, baseline never), recording scope changes, naming test levels. These are process properties — the system's rules show up in behavior.
- **A consistent AgentFlow weakness — planning:** AgentFlow stops at *blocking questions* before it recommends applications and stack, so it fails "ends by asking to approve applications and stack" (P7) that the baseline often passes, and on Sonnet it asked more questions than the case allows. This is the pipeline doing what it says (questions → behavior → apps/stack → Gate 2), but on a short request the user waits a round longer for a concrete proposal. Worth a decision: propose a provisional stack alongside the questions.
- **No technical advantage:** both arms find the same architecture trade-offs and security weaknesses.
- **Cost:** AgentFlow is ~2.8× (Opus) and ~2.6× (Sonnet) the cost per request, and ~2× the time.
- **On the earlier pilot:** the blind judge scored it lower than the author did (e.g. `planning-agentflow-1` 5/7 blind vs 7/7 by hand) — the reason to stop author-scoring.

## Workflow and technology checks (AgentFlow only, judged blind)

| Check | Runs | Scores |
|---|---|---|
| password-reset · duplicate-notifications · pagination · rename-service | 1 each | 5/5 · 5/5 · 5/5 · 4/4 |
| tenant-isolation | 3 | 4/5, 5/5, 5/5 |
| keep-existing-stack · new-project-versions | 1 each | 4/4 · 5/5 |
| **new-project-versions-web** (WebFetch + `npm view`) | 2 | 5/5, 5/5 — verified versions live; one run caught that Prisma's `latest` tag was `8.0.0-rc.21` and chose the newest stable instead |
| **existing-project-triggers** — before fix | 2 | 5/6, 4/6 — vulnerability listed as a note, not escalated |
| — after audit-skill fix | 2 | 4/6, 5/6 — no change |
| — after operating-rule fix (`OPERATING_RULES` §9) | 2 | **6/6, 6/6** — opened as `BUG-003 · P1` first, CVEs named, "checked from memory" labelled, smallest safe fix |

Judge cost for all of the above: ~$5.
