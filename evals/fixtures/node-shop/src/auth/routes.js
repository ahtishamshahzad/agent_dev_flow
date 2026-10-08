const router = require('express').Router();
router.post('/login', async (req, res) => res.json({ token: 'jwt' }));
router.post('/logout', async (req, res) => res.sendStatus(204));
module.exports = router;
