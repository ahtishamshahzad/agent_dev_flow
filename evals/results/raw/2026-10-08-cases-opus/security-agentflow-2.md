# security-agentflow-2

- Arm: **agentflow** · Case: `security` · Turns: 1 · Cost: $0.09950880000000001 · 20 s
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

# PR Review: do not merge yet

There are four blocking problems: two are critical security holes, one exposes a secret, and one is a missing authorization check.

## 🔴 Blocking

### 1. SQL injection in `POST /invoices/:id/notes`
```js
await db.query(`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`);
```
Both `notes` and `id` are pasted straight into the SQL string. If someone sends `notes` = `x'; DROP TABLE invoices; --`, or `:id` = `1 OR 1=1`, the database runs it. Here, `1 OR 1=1` would overwrite the notes on every invoice. Use a parameterized query instead:
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2', [req.body.notes, req.params.id]);
```
(Use `?` placeholders if the driver is MySQL.)

### 2. Any logged-in user can read any invoice (IDOR) in `GET /invoices/:id`
`requireLogin` only checks that the caller is logged in. It doesn't check that the invoice belongs to them. Any user can read other customers' invoices by changing the ID in the URL. Add the owner to the lookup:
```js
const invoice = await Invoice.findOne({ _id: req.params.id, ownerId: req.user.id });
if (!invoice) return res.sendStatus(404);
```
Return 404 rather than 403 so the response doesn't reveal which IDs exist.

### 3. Same authorization gap on the notes route
Any logged-in user can change notes on any invoice. Scope the update to the owner and return 404 if no row matched:
```js
const result = await db.query(
  'UPDATE invoices SET notes = $1 WHERE id = $2 AND owner_id = $3',
  [req.body.notes, req.params.id, req.user.id]
);
if (result.rowCount === 0) return res.sendStatus(404);
```

### 4. Live Stripe secret key hardcoded in `config.js`
`sk_live_…` is a production secret key. Even if this value is a placeholder, the pattern is wrong:
- Load it from the environment: `stripeKey: process.env.STRIPE_SECRET_KEY`, and fail at startup if it's missing.
- If a real key was ever committed or pushed to any branch, **rotate it in the Stripe dashboard now**. Deleting it in a later commit doesn't remove it from git history.
- Consider adding a secret scanner (e.g. gitleaks) as a pre-commit or CI check.

## 🟡 Should fix

5. **Missing invoice returns `200 null`.** `findById` returns `null` when nothing matches, and the route sends that with a 200. Return 404 (the fix in #2 handles this).
6. **Errors aren't handled.** On Express 4, a rejected `await` (bad ID format, DB down) isn't caught. The request hangs and Node logs an unhandled rejection. Wrap the handlers in try/catch or use `express-async-errors`, or upgrade to Express 5, which forwards async errors.
7. **`notes` isn't validated.** Check that it's a string and cap its length before writing it.
8. **Mixed data access.** One route uses an ORM (`Invoice.findById`) and the other uses raw SQL (`db.query`). If `Invoice` is Mongoose, the IDs probably aren't numeric, so `WHERE id = ${id}` may never have matched anything. Confirm which data store this is and use one approach.

## Tests to add before merge
- User A requests user B's invoice → 404 (for both GET and POST).
- `notes` containing `'` and SQL metacharacters is stored exactly as sent.
- A non-numeric or malformed `:id` returns 400/404, not a 500 or a hung request.

I reviewed only the pasted diff and didn't run anything. I haven't checked how `requireLogin` sets `req.user`, or what the invoice owner column is actually called. Adjust `ownerId`/`owner_id` to match your schema.
