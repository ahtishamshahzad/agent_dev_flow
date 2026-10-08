const express = require('express');
const app = express();
app.use(express.json());
for (const m of ['auth', 'users', 'catalog', 'cart', 'orders', 'billing', 'shipping', 'reports', 'admin', 'search', 'reviews', 'uploads']) {
  app.use('/' + m, require('./' + m + '/routes'));
}
require('./notifications/subscribers');
module.exports = app;
