const router = require('express').Router();
const db = require('../core/db');
const events = require('../core/events');
const { sendShippedEmail } = require('../notifications/emails');

// Mark an order shipped and tell the customer.
router.post('/:id/ship', async (req, res) => {
  const order = (await db.query('update orders set status=$2 where id=$1 returning *', [req.params.id, 'shipped'])).rows[0];
  events.emit('order.shipped', order);
  await sendShippedEmail(order);
  res.json(order);
});

router.get('/:id', async (req, res) => res.json((await db.query('select * from orders where id=$1', [req.params.id])).rows[0]));
module.exports = router;
