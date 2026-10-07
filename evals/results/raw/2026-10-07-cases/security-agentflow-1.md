# security-agentflow-1

- Arm: **agentflow** · Case: `security` · Turns: 3 · Cost: $0.12820540000000002 · 22 s

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

**Verdict: don't merge.** The diff has three serious security problems: one Critical and two High.

I reviewed only the pasted diff. I couldn't see `requireLogin`, the `Invoice` model, the `db` client, or any tests, so anything that depends on them is marked as potential.

---

### 1. Critical: live Stripe secret key hardcoded in source (confirmed)
**`config.js`**: `stripeKey` is a string literal with the `sk_live_` prefix, which is a production Stripe secret key. I've left the value out here.

- Anyone who can read the repo (forks, CI logs, backups) gets full API access to your Stripe account: charges, refunds, payouts and customer data.
- **Rotate the key in the Stripe dashboard now.** Do this even though it's only in a PR, because the branch has already been pushed. Removing it in a later commit doesn't help, since it stays in git history.
- Fix:
  ```js
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) throw new Error('STRIPE_SECRET_KEY is not set');
  module.exports = { stripeKey };
  ```
  Also add `STRIPE_SECRET_KEY=` to `.env.example`, check that `.env` is git-ignored, and consider removing the key from history (`git filter-repo`) and adding a secret scanner (gitleaks or similar) to pre-commit and CI.

### 2. High (could be Critical depending on the DB driver): SQL injection
**`POST /invoices/:id/notes`** puts `req.body.notes` and `req.params.id` straight into the SQL string.

- Example: `notes = "x', notes = (SELECT ...) WHERE '1'='1"` or `id = "1 OR 1=1"` lets someone rewrite every invoice's notes or pull data out through them. If the driver allows multiple statements in one query, an attacker could run any SQL they like (`; DROP TABLE ...`).
- Ordinary input also breaks it: any note containing an apostrophe (`"client's request"`) causes a SQL error.
- Fix: use a parameterized query (placeholder style depends on the driver):
  ```js
  await db.query('UPDATE invoices SET notes = $1 WHERE id = $2 AND owner_id = $3',
    [req.body.notes, req.params.id, req.user.id]);
  ```

### 3. High: IDOR (missing ownership check) on both routes
`requireLogin` only checks that the user is logged in, not that the invoice is theirs.

- **GET**: any logged-in user can read any invoice by trying IDs (`/invoices/1`, `/invoices/2`, …). That exposes other customers' billing data.
- **POST notes**: any logged-in user can overwrite notes on any invoice.
- Fix: limit the lookup to the current user or tenant and return 404 when it doesn't match:
  ```js
  const invoice = await Invoice.findOne({ _id: req.params.id, ownerId: req.user.id });
  if (!invoice) return res.sendStatus(404);
  ```
  If admins need wider access, check the role on the server side.

### 4. Medium: no input validation or error handling
- `req.params.id` isn't validated. If `findById` is Mongoose, a malformed ID throws a `CastError`. In Express 4 an async route that throws an uncaught error leaves the request hanging or, depending on the setup, can leak stack traces. Validate the ID format and wrap the handler in try/catch (or use `express-async-errors`, or move to Express 5).
- `req.body.notes` isn't checked for type or length. Add a schema check (zod or joi): it must be a string with a sensible maximum length.
- **Potential (I can't see where notes are rendered):** if notes are ever shown as HTML, this is stored XSS. Escape the notes when they're displayed.

### 5. Low
- GET returns `200` with body `null` for an ID that doesn't exist. It should return `404`.
- `res.json(invoice)` sends the whole database record. Consider a whitelist of fields so internal fields don't leak.
- The POST returns `204` even when no row was updated. Check the affected-row count and return `404` when it's zero.

---

### Before merging
1. Rotate the Stripe key and move it to an environment variable. This needs a human to do it in Stripe.
2. Parameterize the query.
3. Add ownership checks to both routes.
4. Add validation and error handling.
5. Add tests: user A can't read or update user B's invoice, a note containing `'` saves correctly, an injection payload is stored as plain text, and a bad or unknown ID returns 404.

I haven't run any scanners or tests; those are unverified until run (e.g. `gitleaks detect`, `npm audit`, the test suite). This code touches invoices and payments, so a second person should also review it before it ships.
