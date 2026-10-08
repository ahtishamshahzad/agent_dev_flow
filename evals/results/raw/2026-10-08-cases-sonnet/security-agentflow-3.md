# security-agentflow-3

- Arm: **agentflow** · Case: `security` · Turns: 1 · Cost: $0.0478308 · 15 s
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

**Recommendation: don't merge.** There are two blocking security issues and one that is probably blocking.

## Blocking

**1. SQL injection in `POST /invoices/:id/notes` (`routes/invoices.js`)**
```js
`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`
```
Both `req.body.notes` and `req.params.id` are interpolated straight into the SQL. Any logged-in user can send a `notes` value like `x', status='paid' --` or an `id` like `1 OR 1=1`. That lets them rewrite every invoice or run arbitrary SQL, depending on the DB permissions.

Fix: use parameterized queries. The placeholder syntax depends on your driver.
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2 AND owner_id = $3',
  [req.body.notes, req.params.id, req.user.id]);
```
Also validate that `id` is an integer or valid ObjectId, and that `notes` is a string with a length cap.

**2. Missing authorization (IDOR) on both routes**
`requireLogin` only checks that someone is logged in. It doesn't check that the invoice belongs to them.
- `GET /invoices/:id` returns any invoice to any user who guesses or enumerates an ID. That exposes customer and billing data.
- The notes route lets any user overwrite any invoice's notes.

Fix: scope every query to the owner, for example `Invoice.findOne({ _id: id, owner: req.user.id })`. Return 404 (not 403) when there's no match, so you don't reveal which IDs exist.

**3. Hardcoded Stripe live key in `config.js`**
The string is `sk_live_…`. The value says "placeholder", but a live-prefixed key in source is a red flag. If it's real, treat it as leaked: rotate it in Stripe and remember it stays in git history. If it's fake, it shouldn't look like a live key. Either way, load it from the environment:
```js
module.exports = { stripeKey: process.env.STRIPE_SECRET_KEY };
```
Fail at startup if the variable is missing. Add `.env` to `.gitignore`, and consider a secret scanner such as gitleaks in CI.

## Should fix

- **Mixed data access.** The GET route uses a Mongoose-style `Invoice.findById`, while the POST route uses raw SQL via `db.query`. If these are different data stores, that's confusing. If they're meant to be the same store, one of them is wrong.
- **No error handling.** The async handlers have no `try/catch`. On Express 4, a rejected promise leaves the request hanging or becomes an unhandled rejection. A malformed ID also throws a cast error. Wrap the handlers or use `express-async-errors`.
- **Null result returns 200.** `findById` returns `null` for a missing invoice, so the client gets `200 null`. It should be a 404.
- **Over-exposure.** `res.json(invoice)` returns the whole document. Return only the fields the client needs, so internal or payment fields don't leak.
- **Write route.** It doesn't check whether any row was updated. It returns 204 even if the invoice doesn't exist. If the app uses cookie sessions, the POST route also needs CSRF protection.
- **No tests.** Add tests for the cross-user access and injection cases.

I reviewed only the diff you pasted. I didn't check the repo for `requireLogin`, the DB layer, or the existing conventions.
