const events = require('../core/events');
const { sendShippedEmail, sendReceipt } = require('./emails');
// Customer emails are sent from domain events.
events.on('order.shipped', (order) => sendShippedEmail(order));
events.on('order.paid', (order) => sendReceipt(order));
