const express = require('express');
const db = require('./db');
const userService = require('./services/userService');
const { requireLogin } = require('./auth');
const { notifyStatusChange } = require('./notifications/sendOnStatusChange');
const events = require('./events');

const app = express();
app.use(express.json());

// Users of the caller's company.
app.get('/users', requireLogin, async (req, res) => {
  const users = await userService.listUsers(req.user.companyId);
  res.json(users);
});

// A project by ID.
app.get('/projects/:id', requireLogin, async (req, res) => {
  const project = await db.projects.findById(req.params.id);
  if (!project) return res.sendStatus(404);
  res.json(project);
});

// Change an order's status and tell the customer.
app.patch('/orders/:id/status', requireLogin, async (req, res) => {
  const order = await db.orders.update(req.params.id, { status: req.body.status });
  events.emit('order.statusChanged', order);
  await notifyStatusChange(order);
  res.json(order);
});

app.post('/login', async (req, res) => {
  const user = await userService.verifyPassword(req.body.email, req.body.password);
  if (!user) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ token: userService.issueToken(user) });
});

module.exports = app;
