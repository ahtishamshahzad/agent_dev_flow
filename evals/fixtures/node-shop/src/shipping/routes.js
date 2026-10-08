const router = require('express').Router();
const carriers = require('./carriers');
router.get('/rates', async (req, res) => res.json(await carriers.rates(req.query.zip)));
module.exports = router;
