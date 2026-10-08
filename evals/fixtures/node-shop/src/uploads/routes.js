const router = require('express').Router();
router.post('/', async (req, res) => res.status(201).json({ url: '/files/1' }));
module.exports = router;
