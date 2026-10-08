const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

async function listUsers(companyId) {
  return db.users.findAll({ where: { companyId }, order: [['createdAt', 'ASC']] });
}

async function verifyPassword(email, password) {
  const user = await db.users.findOne({ where: { email: email.trim().toLowerCase() } });
  if (!user) return null;
  return (await bcrypt.compare(password, user.passwordHash)) ? user : null;
}

function issueToken(user) {
  return jwt.sign({ sub: user.id, companyId: user.companyId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports = { listUsers, verifyPassword, issueToken };
