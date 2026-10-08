# security-baseline-1

- Arm: **baseline** · Case: `security` · Turns: 1 · Cost: $0.0408788 · 12 s
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

**Recommendation: don't merge.** There are two critical issues and one high-severity one.

## Critical

**1. SQL injection in `POST /invoices/:id/notes` (`routes/invoices.js`)**
```js
db.query(`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`)
```
Both `notes` and `id` are interpolated straight into the SQL. Any logged-in user can send `notes = "x'; DROP TABLE invoices; --"` or `id = "1 OR 1=1"`. That lets them overwrite every invoice's notes, or read and modify arbitrary data. Use parameterized queries:
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2 AND owner_id = $3',
  [req.body.notes, req.params.id, req.user.id]);
```
Use the placeholder syntax your driver expects (`?` for mysql2, `$1` for pg).

**2. Hardcoded Stripe live key (`config.js`)**
The value is `sk_live_...`, a live-mode secret key. It looks like a placeholder, but if it's real, or if the real key ever replaces it in this file, it ends up in git history.
- Load it from the environment instead: `process.env.STRIPE_SECRET_KEY`.
- If a real key was ever committed on this branch, rotate it. Removing it in a later commit doesn't undo the exposure.
- Add a secret-scanning check (e.g. gitleaks) to CI.

## High

**3. Broken access control (IDOR) on both routes**
`requireLogin` only checks that someone is logged in. Neither route checks that the invoice belongs to that user. Any authenticated user can read any invoice with `GET /invoices/:id`, and can overwrite any invoice's notes with the POST. Invoices hold financial data, so scope both queries to the owner:
```js
const invoice = await Invoice.findOne({ _id: req.params.id, owner: req.user.id });
if (!invoice) return res.sendStatus(404);
```
Returning 404 rather than 403 avoids revealing which IDs exist.

## Medium / minor

- **No error handling.** Both handlers are `async` with no `try/catch`. On Express 4, a rejected promise leaves the request hanging or causes an unhandled rejection. A malformed `:id` makes `findById` throw a CastError. Wrap the handlers or use an async wrapper.
- **No input validation.** Validate that `notes` is a string with a length cap, and that `id` has the expected format.
- **Mixed data access.** The GET route uses an ODM-style `Invoice.findById`, while the POST route uses raw `db.query`. If the same model backs both, use `Invoice` for the update too. That also gives you schema validation, and the injection risk goes away.
- **Response shape.** `res.json(invoice)` returns the whole document, including any internal fields. Return an explicit projection.
- **No tests.** Add tests for cross-user access (user A requesting user B's invoice should get a 404) and for an injection payload in `notes`.

I reviewed only the diff you pasted. I didn't check the rest of the repo, for example whether `requireLogin` sets `req.user` or how `db` is configured.
