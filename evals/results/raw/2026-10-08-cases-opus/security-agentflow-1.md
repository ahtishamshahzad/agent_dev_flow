# security-agentflow-1

- Arm: **agentflow** · Case: `security` · Turns: 1 · Cost: $0.09935279999999999 · 21 s
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

# PR Review: don't merge yet

This PR has two critical security problems and one high-severity one.

## Critical

**1. SQL injection in `POST /invoices/:id/notes`**
```js
await db.query(`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`);
```
`req.body.notes` and `req.params.id` go straight into the SQL string. Any logged-in user can send notes like `', notes = 'x' WHERE 1=1; --` and overwrite every invoice. Depending on the driver and DB permissions, they may be able to read or delete data too. `id` isn't quoted, so you can inject through the URL as well. Use parameterized queries:
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2 AND owner_id = $3',
  [req.body.notes, req.params.id, req.user.id]);
```
(Use `?` placeholders if the driver is MySQL.)

**2. A live Stripe secret key is in source (`config.js`)**
`sk_live_...` is a production secret key. Even if this value is a placeholder, the pattern is wrong.
- If any real key has ever been committed, **rotate it in the Stripe dashboard now**. Taking it out of a later commit is not enough, because it stays in git history and forks.
- Load it from the environment: `stripeKey: process.env.STRIPE_SECRET_KEY`. Fail fast at startup if it's missing.
- Add secret scanning (e.g. gitleaks or GitHub push protection) so this gets caught before review.

## High

**3. Broken access control (IDOR) on both routes**
`requireLogin` only checks that the user is logged in. It doesn't check that the invoice is theirs. Any logged-in user can read any invoice with `GET /invoices/1`, `/2`, and so on, and add notes to any invoice. Scope both queries to the current user or tenant, and return 404 when there's no match:
```js
const invoice = await Invoice.findOne({ _id: req.params.id, owner: req.user.id });
if (!invoice) return res.sendStatus(404);
```

## Medium / Low

4. **Missing error handling:** if the id is invalid (e.g. a Mongoose `CastError`) or the DB fails, the promise is rejected and nothing handles it. On Express 4 the request hangs or the process warns. Wrap the handlers, use Express 5, or add `express-async-errors`. Also check the id format before querying.
5. **Missing invoice returns `200 null`:** `GET` sends `res.json(null)` when nothing is found. It should return 404.
6. **No input validation on `notes`:** there's no check on type or length. A user could send an object, an array or a huge string. Validate it with zod, joi or express-validator.
7. **Two data-access styles:** `Invoice.findById` looks like Mongoose/ODM, but the notes route uses raw SQL. Is that intended? If both run against the same store, use the model/ORM for the update too. That removes the injection risk and keeps the code consistent.
8. **Too much data in the response:** `res.json(invoice)` returns the whole document. Check that it has no internal fields (payment-processor IDs, other users' data) and pick only the fields the client needs.
9. **CSRF:** if `requireLogin` uses cookie sessions, the `POST` route needs CSRF protection or `SameSite` cookies.

## Before merging
- [ ] Parameterize the SQL in the notes route
- [ ] Remove the key, read it from the environment, and rotate it if a real key was ever committed
- [ ] Add ownership checks to both routes
- [ ] Return 404 when the invoice isn't found, and handle async errors
- [ ] Add tests: cross-user access returns 404, and an injection payload in `notes` is stored as plain text

I reviewed only the diff you pasted. This directory isn't a git repo, so I couldn't see `requireLogin`, the `Invoice` model or the `db` driver, and some of the details above depend on those. Nothing was run.
