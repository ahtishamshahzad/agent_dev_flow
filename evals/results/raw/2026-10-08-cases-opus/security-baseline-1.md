# security-baseline-1

- Arm: **baseline** · Case: `security` · Turns: 1 · Cost: $0.0686168 · 15 s
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

**Verdict: don't merge yet.** The diff has three serious security problems.

## Blockers

### 1. SQL injection in `POST /invoices/:id/notes` (critical)
```js
await db.query(`UPDATE invoices SET notes = '${req.body.notes}' WHERE id = ${req.params.id}`);
```
Both `notes` and `id` are pasted straight into the SQL string. With notes set to `x' WHERE 1=1; --`, a request would overwrite the notes on every invoice. An `id` of `1 OR 1=1` does the same, and worse payloads are possible depending on the driver and whether it allows stacked queries. Use a parameterized query:
```js
await db.query('UPDATE invoices SET notes = $1 WHERE id = $2', [req.body.notes, req.params.id]);
```
(Use `?` placeholders if this is MySQL.)

### 2. IDOR / missing authorization on both routes (critical)
`requireLogin` only checks that the user is logged in. It doesn't check that they own the invoice. Any logged-in user can read any invoice by stepping through IDs (`GET /invoices/1`, `/2`, …) and can write notes on anyone's invoice. Scope both queries to the current user or their org:
```js
const invoice = await Invoice.findOne({ _id: req.params.id, ownerId: req.user.id });
if (!invoice) return res.sendStatus(404);
```
Add the same ownership condition to the `UPDATE`'s `WHERE` clause, and return 404 when no rows change.

### 3. Hardcoded live Stripe secret key in `config.js` (critical)
`sk_live_...` is a production secret key. Even if this exact value is a placeholder, the pattern is wrong:
- Load it from the environment instead: `stripeKey: process.env.STRIPE_SECRET_KEY`, and fail fast at startup if it's missing.
- **If a real key was ever committed to any branch, rotate it in the Stripe dashboard now.** Removing it in a later commit doesn't help, because it stays in git history and in any forks or CI caches.
- Consider adding a secret scanner such as gitleaks, trufflehog or GitHub push protection to block this in the future.

## Other issues
- **Missing-record handling:** `GET` returns `200` with a `null` body when the invoice doesn't exist. Return `404` instead.
- **Invalid IDs:** if this is Mongoose, a malformed `:id` makes `findById` throw a `CastError`. Express 4 doesn't catch rejected promises from async handlers, so the request hangs or triggers an unhandled rejection. Validate the ID and wrap the handler (or use Express 5 or `express-async-errors`).
- **Mixed data access:** one route uses an ORM (`Invoice.findById`) and the other uses raw SQL (`db.query`). If they really point at the same store, use the ORM for both, which also avoids the injection risk. If they point at different stores, that's worth a closer look.
- **Input validation:** `notes` has no type or length check. Validate that it's a string with a sensible maximum length.
- **Over-exposure:** `res.json(invoice)` returns the whole document. Check that no internal fields go out, such as Stripe customer or payment IDs or internal flags.
- **Audit trail:** invoices are financial records, so consider logging who changed the notes and when.

## Summary
| # | Issue | Severity |
|---|---|---|
| 1 | SQL injection in notes update | Critical |
| 2 | No ownership check (IDOR) on read and write | Critical |
| 3 | Hardcoded live Stripe key | Critical (rotate if real) |
| 4 | No 404 handling or error handling | Medium |
| 5 | No input validation or field filtering | Low–Medium |

Fix 1 to 3 before merging. I can write the corrected version of both files if you tell me which DB and driver you're using.
