const router = require('express').Router();
const db = require('../core/db');
router.get('/:id', async (req, res) => res.json((await db.query('select * from users where id=$1', [req.params.id])).rows[0]));
module.exports = router;
