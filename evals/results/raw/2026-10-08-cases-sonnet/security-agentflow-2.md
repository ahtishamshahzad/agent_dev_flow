# security-agentflow-2

- Arm: **agentflow** · Case: `security` · Turns: 1 · Cost: $0.0472208 · 16 s
- Project files (besides installed `.ai/`): `AGENTS.md`, `CLAUDE.md`, `QUICK_START.md`, `USAGE.md`

## Prompt

Please review this PR before we merge.

```diff
+// routes/invoices.js
+router.get('/invoices/:id', requireLogin, async (req, res) => {
+  const invoice = await Invoice.findById(req.params.id);
+  res.json(invoice);
+});
+
+router.post('/invoices/:id/notes', requireLogin, async (req, res) => {
+  await db.query(`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`);
+  res.sendStatus(204);
+});
+
+// config.js
+module.exports = { stripeKey: 'sk_live_51Hx9Qe-placeholder-8f2c' };
```

## Final response

**Recommendation: block the merge.** There is one critical injection bug, one authorization gap on both routes, and a credential in source.

## Blocking

**1. SQL injection in `POST /invoices/:id/notes` (`routes/invoices.js`)**
```js
`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`
```
Both `req.body.notes` and `req.params.id` go straight into the SQL string. Any logged-in user can send `notes = "x'; UPDATE users SET role='admin' --"`. The unquoted `id` is just as exploitable, since it needs no quote to break out. Use parameters instead:
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2 AND owner_id = $3',
  [req.body.notes, req.params.id, req.user.id]);
```
Use the placeholder style your driver expects (`?` for MySQL).

**2. No authorization check on either route (IDOR)**
`requireLogin` only proves the caller is authenticated. Neither handler checks that the invoice belongs to the caller or their organization.
- `GET /invoices/:id` returns any invoice to any user who iterates ids.
- `POST /invoices/:id/notes` lets any user overwrite any invoice's notes.

Scope both queries by owner or tenant, for example `findOne({ _id: id, owner: req.user.id })`. Return 404 rather than 403 when the invoice isn't theirs.

**3. Stripe live key committed in `config.js`**
The value is `sk_live_…` and is labeled "placeholder". If it's fake, it shouldn't carry the live prefix. If it's real, or ever was, rotate it in Stripe now, because it stays in git history after you remove it. Either way, load it from the environment (`process.env.STRIPE_SECRET_KEY`), keep it out of the repo, and fail at startup if it's missing. Consider adding a secret scanner such as gitleaks to CI.

## Should fix

- **Unhandled async errors.** Neither handler has try/catch. On Express 4, a rejected promise leaves the request hanging and can crash the process. Wrap the handlers or use `express-async-errors`. Express 5 handles this itself.
- **Missing 404.** `findById` returns `null` for an unknown id, so `GET` responds `200 null`. Return 404 instead.
- **No input validation.** Validate that `id` has the expected format and that `notes` is a string with a length cap.
- **Mixed data access.** One route uses the `Invoice` model and the other uses raw `db.query`. Using the model for both would remove the injection risk and make scoping easier.
- **Overexposed response.** `res.json(invoice)` serializes the whole document. Return only the fields the client needs.
- **No tests.** The diff has no tests for the cross-user access and injection cases above. Add them.

I reviewed only the diff you pasted. I didn't check the surrounding code, such as how `requireLogin` populates `req.user`, so the exact ownership field in the fixes is an assumption.
