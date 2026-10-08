const mailer = require('./mailer');
async function sendShippedEmail(order) {
  await mailer.send(order.email, 'Your order ' + order.id + ' has shipped');
}
async function sendReceipt(order) {
  await mailer.send(order.email, 'Receipt for order ' + order.id);
}
module.exports = { sendShippedEmail, sendReceipt };
