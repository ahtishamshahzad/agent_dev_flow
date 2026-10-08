# Evaluation — context efficiency

**Quality:** P1–P6, judged blind like every case.

**Efficiency** (recorded by `run.js` from the agent's tool calls, reported by `summarize.js`):

- **Files read** — distinct files opened with the Read tool.
- **Retrieval efficiency** — relevant files read ÷ files read, against `relevant.txt`. 1.0 means nothing irrelevant was opened.
- **Recall** — relevant files read ÷ relevant files. Reading too little is a failure too.
- **Tool calls**, **repeated reads** (the same file read more than once), **tokens** and **cost** as reported by the CLI. Input tokens = uncached + cache writes + cache reads; a large, fixed share of them is the agent CLI's own system prompt, identical in both arms.

**Limits of the file metrics:** they count the Read tool only. A search (`Grep`) also shows file content, so an agent that finds the cause through search can show low recall while having seen the right lines — read recall with the transcript, not alone.

**How to read the result:** efficiency only counts alongside quality. An arm that reads fewer files but misses the cause (P1) is worse, not better. Report both, per run.

**Trap:** the module list in `app.js` invites a tour of every module; the shipping module's name invites a detour. The direct path is: orders route → the event it emits → the subscriber.

The AgentFlow arm's `.ai/` reads (rules, skills) are counted separately from project files — they are the system's own overhead and are reported as such, not hidden.
