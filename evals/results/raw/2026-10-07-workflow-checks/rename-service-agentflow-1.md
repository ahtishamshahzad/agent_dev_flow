# rename-service-agentflow-1

- Arm: **agentflow** · Case: `rename-service` · Turns: 13 · Cost: $0.2271854 · 32 s

## Prompt

Rename the internal userService to accountService.

## Final response

I haven't renamed anything yet. This session has no tools for editing or moving files (I can only read and search), and the project's refactor rules say to stop and check with you first because this code has no tests.

**How I classified it:** this is a refactor under `.ai/workflows/refactor.md`. Nothing users can see changes: the `/users` and `/login` routes, response fields and function names all stay the same. So `.ai/system/GHERKIN_RULES.md:15` says no new Gherkin scenarios are needed, and the approval gates for behavior, stack and tasks don't apply.

**Where `userService` is used** (searched the whole repo, any capitalisation):
- `src/services/userService.js`: the module itself, which exports `listUsers`, `verifyPassword` and `issueToken`
- `src/app.js:3`: `require('./services/userService')`
- `src/app.js:13, 33, 35`: calls to `userService.listUsers`, `.verifyPassword` and `.issueToken`

There are no other references in code, config or docs.

**The rename:**
1. Rename the file: `src/services/userService.js` → `src/services/accountService.js` (contents unchanged).
2. In `src/app.js:3`: `const accountService = require('./services/accountService');`
3. In `src/app.js:13, 33, 35`: change `userService.` to `accountService.`
4. Search again for `userService` and expect no matches.

The functions keep their names (`listUsers` and so on). Tell me if you want those renamed too.

**What blocks it under the project rules:**
- **No tests.** `package.json` runs `node --test`, but there are no test files. `.ai/workflows/refactor.md:41` says to stop if the code being refactored has no tests and none are added first.
- **The app can't start, so even a basic "does it load" check won't run:**
  - `bcrypt` and `jsonwebtoken` are used but not listed in `package.json`.
  - `src/app.js` requires `./db`, `./auth` and `./events`, but those files don't exist.

  Whatever we choose, any check after the rename stays unverified until those gaps are fixed.

**Decision needed:**
- **A — Rename now, without tests (my recommendation).** It's only the file and variable name, and step 4 confirms nothing still points to the old name. It needs your explicit go-ahead because it skips the rule above.
- **B — Add tests for `listUsers`, `verifyPassword` and `issueToken` first, then rename.** That means a test setup and mocks for the missing modules.

Either way, the session needs file editing turned on so I can make the change. There's no git repo here, so there's nothing to commit.
