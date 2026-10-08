const router = require('express').Router();
router.post('/items', async (req, res) => res.status(201).json({ ok: true }));
module.exports = router;
