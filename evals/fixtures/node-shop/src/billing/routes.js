const router = require('express').Router();
const stripe = require('./stripe');
router.post('/charge', async (req, res) => res.json(await stripe.charge(req.body.orderId)));
module.exports = router;
