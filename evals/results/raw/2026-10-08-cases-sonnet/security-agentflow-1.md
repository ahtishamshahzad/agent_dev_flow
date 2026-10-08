# security-agentflow-1

- Arm: **agentflow** · Case: `security` · Turns: 1 · Cost: $0.0383408 · 12 s
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

**Recommendation: do not merge.** There are three blocking security problems.

### Blocking

**1. SQL injection in `POST /invoices/:id/notes`** (`routes/invoices.js`)
- `req.body.notes` and `req.params.id` are interpolated straight into the SQL string.
- Any logged-in user can send `notes = "x'; UPDATE users SET role='admin' WHERE '1'='1"` to run arbitrary SQL. They can also use `id` for injection, since it isn't quoted at all.
- Fix by using parameterized queries:
  ```js
  await db.query('UPDATE invoices SET notes = $1 WHERE id = $2', [req.body.notes, req.params.id]);
  ```
  The placeholder syntax depends on your driver (`?` for mysql2, `$1` for pg). Also validate that `id` has the expected format.

**2. Broken access control (IDOR) on both routes**
- `requireLogin` only checks that someone is authenticated. Neither route checks that the invoice belongs to the caller.
- Any user can read any invoice with `GET /invoices/<id>`, and can overwrite the notes on any invoice with the POST. Sequential or guessable IDs make this easy to enumerate.
- Fix by scoping queries to the owner, for example `Invoice.findOne({ _id: id, ownerId: req.user.id })` and `... WHERE id = $2 AND owner_id = $3`. Return 404 when nothing matches, so you don't reveal which IDs exist.

**3. Hardcoded Stripe live key** (`config.js`)
- `sk_live_...` is committed in source. The `-placeholder-` text suggests it may be fake, but the `sk_live_` prefix means secret scanners will flag it. If it's real, it's compromised the moment it lands in git history.
- Load it from the environment instead: `process.env.STRIPE_SECRET_KEY`.
- If the value is real or was ever pushed, rotate it. Removing it in a later commit doesn't remove it from history.

### Should fix

- **No error handling in the async handlers.** If Express is below v5, a rejected promise from `findById` or `db.query` leaves the request hanging and can cause an unhandled rejection. Wrap the handlers or use an async wrapper.
- **`GET` returns `null` with a 200 when the invoice doesn't exist.** Return 404. A malformed ID may also throw a cast error, which should be a 400.
- **Returns the whole invoice document.** Check that it doesn't expose internal or sensitive fields. Consider a projection or DTO.
- **No validation on `notes`.** Check its type and length. Also check CSRF protection on the state-changing POST if you use session cookies.
- **Mixed data access.** The GET uses an ORM model (`Invoice`) and the POST uses raw `db.query`. Using the model for both would remove the injection risk and keep the code consistent.

### Missing
- There are no tests. At minimum, add cases for a user accessing another user's invoice and for an injection payload in `notes`.

I reviewed only the pasted diff. The working directory isn't a git repo, and I didn't check `requireLogin` or the `Invoice` model, so the Express version and the ownership field name are assumptions.
