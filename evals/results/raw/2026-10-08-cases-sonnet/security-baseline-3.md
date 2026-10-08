# security-baseline-3

- Arm: **baseline** · Case: `security` · Turns: 1 · Cost: $0.0406208 · 15 s
- Project files (besides installed `.ai/`): none

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

**Don't merge this yet.** There are three blocking security issues and a few smaller ones.

## Blocking

**1. SQL injection in `POST /invoices/:id/notes` (`routes/invoices.js`)**
```js
db.query(`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`)
```
Both `notes` and `:id` are interpolated straight into the SQL. A user can send `notes = "x', amount = 0 --"`, or `id = "1 OR 1=1"`, and rewrite or corrupt every invoice. Use parameterized queries instead. The placeholder syntax depends on your driver:
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2', [req.body.notes, req.params.id]);
```

**2. Missing authorization (IDOR) on both routes**
`requireLogin` only checks that the caller is logged in. It doesn't check that they own the invoice. Any logged-in user can read any invoice with `GET /invoices/<any id>`, and can overwrite its notes with the POST route. Scope the queries to the current user or account, for example `Invoice.findOne({ _id: req.params.id, ownerId: req.user.id })`. Add the same condition to the `UPDATE`'s `WHERE` clause. Return 404 when nothing matches.

**3. Hardcoded Stripe live key in `config.js`**
The value is labeled "placeholder", but the `sk_live_` prefix means it will be treated as a live secret. Once it's committed, it stays in git history and in any forks or clones. If it's real, rotate it in Stripe now. In either case, load it from the environment (`process.env.STRIPE_KEY`) and keep it out of the repo. Consider adding secret scanning to CI.

## Should fix

- **Unhandled async errors.** If you're on Express 4, a rejected promise in these handlers won't reach the error middleware. It can leave the request hanging or crash the process. Wrap the handlers or use `express-async-errors`.
- **No not-found handling.** `findById` can return `null`, so `GET` responds 200 with `null`. The `POST` returns 204 even when no row matched. Check the result and return 404.
- **No input validation.** Validate that `:id` has the expected format and that `notes` is a string within a length limit.
- **Over-exposure.** `res.json(invoice)` returns the whole document. Return only the fields the client needs.
- **Tests.** The PR has none. At minimum, add tests that a user can't read or edit another user's invoice, and that a quote in `notes` doesn't change the query.

I can write the fixed version of these routes if you'd like. I haven't seen the rest of the repo, so I'd be guessing at the ownership field and the DB driver.
