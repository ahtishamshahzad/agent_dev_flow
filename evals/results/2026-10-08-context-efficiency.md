# Context efficiency — 2026-10-08 · Claude Code 2.1.292 · AgentFlow 1.8.0 · judged blind by claude-opus-5-5

> 3 runs per arm per model on `context-efficiency` (27-file `node-shop` fixture, three relevant files). Tokens and tool calls are as reported by the Claude Code CLI; input tokens = uncached + cache writes + cache reads. Raw: `raw/2026-10-08-context-{opus,sonnet}/`, `raw/2026-10-08-insufficient-context/`.

## Results

| Model · arm | Quality (blind) | Input tokens | Output tokens | Tool calls | Files read | Relevant ÷ read | Recall | Cost |
|---|---|---|---|---|---|---|---|---|
| Opus · AgentFlow | **100%** (6/6 ×3) | 54,140 | 1,235 | 4.7 | 2.7 | 92% | 78% | $0.115 |
| Opus · baseline | 83% (5/6 ×3) | **45,123** | 995 | 3.3 | 1.3 | 100% | 44% | $0.099 |
| Sonnet · AgentFlow | 83% (5/6 ×3) | 47,974 | 937 | 3.7 | 2.7 | **100%** | 89% | $0.057 |
| Sonnet · baseline | 83% (5/6 ×3) | **44,848** | 944 | 4.0 | 2.7 | 92% | 78% | $0.052 |

## What this shows — and doesn't

- **AgentFlow did not reduce tokens on this task.** It used ~20% (Opus) and ~7% (Sonnet) **more** input tokens. Most of the difference is its rules loaded at session start; the rest is reading the files a fix needs.
- **What the extra context bought was quality on Opus:** every AgentFlow run specified the regression test (P4: 100% vs 0%). On Sonnet, quality tied.
- **Retrieval was already lean in both arms.** On a small, well-named codebase, the baseline needed two searches and one or two files; the planted bug was findable by name. A larger or less tidy codebase — where reading broadly is tempting — is the next test; this one doesn't show it.
- **AgentFlow read more of the relevant set** (recall 78–89% vs 44–78%) without reading irrelevant files.
- Retrieval metrics count the Read tool only; searches also show content (see `../context-efficiency/evaluation.md`).

**Conclusion:** no token saving measured. Context engineering here traded a small, measured token increase for completeness of the fix on one model and parity on the other. It is designed to reduce *unnecessary* context; whether it does so at scale is unmeasured.

## Insufficient context (AgentFlow, Opus, 2 runs)

| Run | Score | Note |
|---|---|---|
| 1 | 3/4 | Named the missing data layer, labelled its guess ("looks like Sequelize, but I'm guessing"), asked for the schema — but also read the notifications module and reported an unrelated bug (P4, proportionate reading) |
| 2 | 4/4 | Named the gap, asked, read nothing unrelated |

Neither run invented the missing API.

Judge cost: ~$1.
