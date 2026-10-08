const router = require('express').Router();
const db = require('../core/db');
router.get('/', async (req, res) => res.json((await db.query('select * from products')).rows));
module.exports = router;
