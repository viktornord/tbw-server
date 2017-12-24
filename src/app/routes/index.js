'use strict';

const user = require('./user');
const auth = require('./auth');

module.exports = {
  auth,
  apply: applyRoutes
};

function applyRoutes(router) {
  router.use('/', user);

  return router;
}
