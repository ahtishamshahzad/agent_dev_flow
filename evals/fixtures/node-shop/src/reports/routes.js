const router = require('express').Router();
router.get('/sales', async (req, res) => res.json({ total: 0 }));
module.exports = router;
