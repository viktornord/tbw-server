'use strict';

const user = require('./user');
const auth = require('./auth');
const blockChain = require('./block-chain');
const transaction = require('./transaction');

module.exports = {
  auth,
  apply: applyRoutes
};

function applyRoutes(router) {
  router.use('/', user);
  router.use('/', blockChain);
  router.use('/', transaction);

  return router;
}
