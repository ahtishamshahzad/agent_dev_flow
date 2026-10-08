# security-baseline-2

- Arm: **baseline** · Case: `security` · Turns: 1 · Cost: $0.0429888 · 15 s
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

**Recommendation: do not merge.** There are three blocking security issues.

## Blocking

**1. SQL injection in `POST /invoices/:id/notes`** (`routes/invoices.js`)
```js
`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`
```
Both `req.body.notes` and `req.params.id` are interpolated straight into the SQL. Any logged-in user can send `notes = "x', amount = 0 --"` or put `1 OR 1=1` in the id. That lets them rewrite or corrupt every invoice, and depending on the DB, read other tables. Use parameterized queries:
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2 AND user_id = $3',
  [req.body.notes, req.params.id, req.user.id]);
```
Use the placeholder syntax your driver expects (`?` for MySQL).

**2. Missing authorization (IDOR) on both routes**
`requireLogin` only checks that someone is logged in. It doesn't check that the invoice belongs to them. Any user can read `GET /invoices/<any id>` and overwrite notes on any invoice by changing the id. Scope both queries to the owner (or their org), for example `Invoice.findOne({ _id: req.params.id, userId: req.user.id })`. Return 404 rather than 403 for invoices that aren't theirs, so ids can't be probed.

**3. Hardcoded Stripe live key in `config.js`**
`sk_live_...` is a live-mode secret key prefix. The value looks like a placeholder, but a key in this format shouldn't be in source. If it is real, or ever was, treat it as leaked: rotate it in Stripe and scrub it from git history, because deleting it in a later commit doesn't remove it. Read it from the environment instead (`process.env.STRIPE_SECRET_KEY`), and fail at startup if it's missing. Also consider a secret-scanning pre-commit hook or CI check.

## Should fix

- **Unhandled promise rejections.** Both handlers are `async` with no `try/catch`. On Express 4, a DB error leaves the request hanging or crashes the process. Wrap them or use `express-async-errors`. Express 5 handles this itself.
- **Missing invoices return 200.** `findById` returns `null` when nothing matches, so the GET responds with `200 null`. Return 404. A malformed id may also throw a cast error, which should be a 400.
- **The POST always returns 204,** even when no row was updated. Check the affected row count and return 404 when it's 0.
- **No validation on `notes`.** Check that it is a string and set a length limit. Also decide whether the frontend renders notes as HTML, since stored XSS is possible if it does.
- **Mixed data access.** The GET uses the `Invoice` model and the POST uses raw `db.query`. Using the model for both would avoid the injection class of bug and keep the access checks in one place.
- **No tests.** Add tests for cross-user access (user A reading or updating user B's invoice) and an injection payload in `notes`.

I only had the diff to go on, so I couldn't check how `requireLogin` populates `req.user` or whether `Invoice` has an owner field. The authorization fix depends on both.
