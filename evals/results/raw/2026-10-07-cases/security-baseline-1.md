# security-baseline-1

- Arm: **baseline** · Case: `security` · Turns: 1 · Cost: $0.0666728 · 14 s

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

**Don't merge this yet.** It has three blocking security issues.

## 🔴 Blocking

### 1. SQL injection in `POST /invoices/:id/notes`
```js
await db.query(`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`);
```
Both `req.body.notes` and `req.params.id` go straight into the SQL string. A note like `', notes = (SELECT ...) --` or an id like `1 OR 1=1` lets any logged-in user overwrite every invoice or pull data out of the database. Use a parameterized query:
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2', [req.body.notes, req.params.id]);
```
(Use `?` placeholders if the driver is MySQL.)

### 2. Missing authorization check (IDOR) on both routes
`requireLogin` only confirms the user is logged in. It doesn't check that the invoice belongs to them. Any user can loop through IDs and read every customer's invoices, or add notes to them. Scope the lookup to the current user or tenant:
```js
const invoice = await Invoice.findOne({ _id: req.params.id, ownerId: req.user.id });
if (!invoice) return res.sendStatus(404);
```
The notes update needs the same check, for example `... WHERE id = $2 AND owner_id = $3`.

### 3. Live Stripe secret key committed in `config.js`
`sk_live_...` is a production secret key. Even if this one is a placeholder, the pattern is wrong. Load it from the environment instead:
```js
module.exports = { stripeKey: process.env.STRIPE_SECRET_KEY };
```
**If the key is real:** removing it in a later commit doesn't help, because it stays in git history and possibly in CI logs, forks or PR caches. Roll it in the Stripe dashboard now, then check whether history needs cleaning. Adding a secret scanner such as gitleaks or GitHub secret scanning would catch this before it reaches review next time.

## 🟡 Should fix

- **Null handling:** if the invoice doesn't exist, `GET` returns `200` with `null`. It should return `404`. The `PUT`/`POST` path also returns `204` even when no row matched.
- **Invalid IDs:** if `Invoice` is a Mongoose model, a malformed id makes `findById` throw a `CastError`. In Express 4 that becomes an unhandled promise rejection and the request hangs. Validate the id, and wrap async handlers or use Express 5.
- **Too much data in the response:** `res.json(invoice)` returns the entire document, including any internal fields. Return an explicit allowlist of fields.
- **No input validation on `notes`:** check the type and set a length limit. If notes are ever rendered as HTML, they also need escaping to prevent stored XSS.
- **Mixed data access:** `GET` uses the ORM/ODM (`Invoice.findById`) but `POST` uses raw `db.query`. Using the model for both would be more consistent and avoids the injection problem entirely.

## Summary
| Issue | Severity |
|---|---|
| SQL injection in notes update | Critical |
| Any logged-in user can read or edit any invoice | Critical |
| Hardcoded live Stripe key | Critical (roll the key if it's real) |
| Missing 404 / error handling | Medium |
| Full document returned, unvalidated input | Low–Medium |

Once the first three are fixed I'm happy to look at it again. Adding tests that check user A gets a 404 for user B's invoice would also help stop the authorization bug from coming back.
