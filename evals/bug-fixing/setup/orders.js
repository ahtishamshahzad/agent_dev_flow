// orders.js
app.post('/orders/:id/pay', async (req, res) => {
  const order = await db.orders.find(req.params.id);
  if (order.status === 'paid') return res.status(409).send('Already paid');
  const charge = await payments.charge(order.customerId, order.total);
  await db.orders.update(order.id, { status: 'paid', chargeId: charge.id });
  res.send({ ok: true });
});
