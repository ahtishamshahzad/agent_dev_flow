# Context engineering in AgentFlow

A guide for people. The binding rules are in [`.ai/system/CONTEXT_MANAGEMENT_RULES.md`](../.ai/system/CONTEXT_MANAGEMENT_RULES.md); the agent's procedure is the [`context-engineering`](../.ai/skills/context-engineering/SKILL.md) skill. This page explains why and how, and links rather than restating.

## Why

An agent can fail by knowing too little — coding straight from a request, it guesses the architecture, duplicates code, breaks what it didn't read — or by reading too much: a whole repository and every rule file dilute its attention, slow it down, and cost money. AgentFlow aims for the **minimum sufficient context**: the smallest set of information that lets the task be understood, changed, tested, and validated correctly.

> Context is an engineering resource. Retrieve the minimum sufficient context, expand only when evidence requires it, and never trade correctness for token savings.

Correctness, security, requirements, existing architecture, testing, and maintainability all come before token efficiency.

## How it works

1. **Classify and budget.** A rename gets a *minimal* budget; a local bug *small*; a feature *medium*; a subsystem or migration *large*.
2. **Anchor on behavior.** The matching Gherkin scenarios are found first — they name the behavior, which names the code. A bug without a regression scenario gets one.
3. **Start small, then escalate on evidence.** Level 1 is the task, global rules, and scenarios. Level 2 adds the affected files and their direct tests. Levels 3–5 add related modules, the broader system, and official documentation — each only on a named trigger: an unknown symbol, a missing contract, conflicting code, a failing test, version-specific or security-sensitive behavior. "To understand the whole repository" is not a trigger.
4. **Every item has a reason.** The agent can say why it read a file (*"called by the failing test and named in the regression scenario"*) and why it escalated.
5. **When something is missing, it retrieves — or asks.** It never guesses to save a lookup.

## Tools

```bash
agentflow context suggest "duplicate notifications on status change"   # where to start, with reasons
agentflow context check                                                 # are the stable summaries still true?
```

`context suggest` ranks matching scenarios, skills (from the intent index), files, tests, and direct imports, deterministically — word matches on paths and content, plus the import graph. It is a starting set to verify by reading, not a retrieval system to trust. No embeddings, no index to maintain.

**Stable summaries** in `.ai/projects/current/context/` keep facts read every session — technology, architecture, testing — short. Each lists the files it was derived from; `context check` fingerprints them and reports any summary whose sources changed, so a summary written before a dependency upgrade is never trusted after it.

**Context packs** (`.ai/templates/CONTEXT_PACK.md`) record, for multi-step or multi-agent work, what was required, optional, and deliberately excluded, with reasons. Parallel agents share one baseline — rules, scenarios, contracts, scope — and each gets only its own slice.

## What is measured, and what isn't

`evals/` runs the same tasks with and without AgentFlow and records, per run: input and output tokens and cost (as reported by the agent CLI), tool calls, files read, and — for the context case — **retrieval efficiency** (relevant files ÷ files read), alongside blind-scored task quality. A smaller context that gets the task wrong is not efficient, so the two are always reported together. No savings figure is claimed beyond what those runs show; see [`evals/results/`](../evals/results/README.md).

## Examples

[`examples/context-engineering/`](../examples/context-engineering/README.md): a simple bug, a medium feature, a complex feature with escalation, a new project, an existing project, and a multi-agent split.
