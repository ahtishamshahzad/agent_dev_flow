const mailer = require('../mailer');
const events = require('../events');

async function notifyStatusChange(order) {
  await mailer.send(order.customerEmail, `Your order ${order.id} is now ${order.status}`);
}

// Every status change emits an event; tell the customer when it happens.
events.on('order.statusChanged', (order) => notifyStatusChange(order));

module.exports = { notifyStatusChange };
