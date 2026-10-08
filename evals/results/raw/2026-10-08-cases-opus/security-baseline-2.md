# security-baseline-2

- Arm: **baseline** · Case: `security` · Turns: 1 · Cost: $0.0948328 · 22 s
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

**Don't merge this yet.** There are three blocking security problems and a few correctness issues.

## 🔴 Blocking

### 1. SQL injection in `POST /invoices/:id/notes`
`req.body.notes` and `req.params.id` go straight into the SQL string. A note like `', notes = (SELECT ...) --` or an id like `1 OR 1=1` lets any logged-in user read or change any row, and possibly do more depending on the database's permissions. Sending `{"notes": "x' WHERE 1=1; --"}` would overwrite the notes on every invoice.

Fix it with a parameterized query (shown below).

### 2. Missing authorization checks (IDOR) on both routes
`requireLogin` only checks that the user is logged in. It doesn't check that the invoice belongs to them. Any user can:
- read any invoice by stepping through IDs: `GET /invoices/1`, `/2`, …
- edit notes on any invoice.

Invoices usually hold customer names, addresses and amounts, so this is a data-exposure bug on its own, even after the injection is fixed. Scope every lookup and update to the current user or account.

### 3. Live Stripe secret key committed to source
`sk_live_...` is a production secret key prefix. The value says "placeholder", but if it's real it's already exposed: it's in the PR diff, in git history, and in any CI logs or forks. To be safe:
- **Rotate the key in the Stripe dashboard now.** Removing it in a later commit doesn't help, because the history keeps it.
- Load it from the environment: `stripeKey: process.env.STRIPE_SECRET_KEY`, and fail at startup if it's missing.
- Consider a secret scanner (gitleaks, GitHub secret scanning) in CI.

## 🟡 Should fix

4. **Missing invoice returns `200 null`.** `findById` returns `null` for an unknown id, and `res.json(null)` sends a 200. It should return a 404.
5. **Unhandled async errors.** On Express 4, a rejected promise in an `async` handler isn't passed to the error middleware, so the request hangs and you get an unhandled rejection. A malformed id that makes `findById` throw a CastError would trigger this. Wrap the handlers, use `express-async-errors`, or upgrade to Express 5.
6. **No input validation on `notes`.** Check that it's a string and set a maximum length. Otherwise clients can send objects or arrays, or very large payloads.
7. **Possible over-sharing in the response.** `res.json(invoice)` sends every field on the document. If the model has internal fields (Stripe IDs, internal flags), return only an allow-listed set.
8. **Two data-access styles.** The PR uses a Mongoose-style `Invoice.findById` and also raw SQL through `db.query`. Is that intentional? If these really are two different stores, the ID formats may not match. If they're the same store, use one access layer for both routes.

## Suggested version

```js
// routes/invoices.js
router.get('/invoices/:id', requireLogin, async (req, res, next) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, ownerId: req.user.id });
    if (!invoice) return res.sendStatus(404);
    res.json(invoice); // consider selecting only public fields
  } catch (err) {
    next(err);
  }
});

router.post('/invoices/:id/notes', requireLogin, async (req, res, next) => {
  try {
    const { notes } = req.body;
    if (typeof notes !== 'string' || notes.length > 5000) return res.sendStatus(400);

    const result = await db.query(
      'UPDATE invoices SET notes = $1 WHERE id = $2 AND owner_id = $3',
      [notes, req.params.id, req.user.id]
    );
    if (result.rowCount === 0) return res.sendStatus(404);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

// config.js
if (!process.env.STRIPE_SECRET_KEY) throw new Error('STRIPE_SECRET_KEY is not set');
module.exports = { stripeKey: process.env.STRIPE_SECRET_KEY };
```

The placeholder syntax depends on your driver: `$1` for `pg`, `?` for `mysql2`. The ownership field names (`ownerId` / `owner_id`) are guesses, so swap in whatever your schema uses for tenancy, such as an account or org ID.

Before re-review, it would help to add tests for these cases:
- user A requests user B's invoice → 404
- a notes payload containing `'` and `--` is stored literally
- a non-string `notes` value → 400
