'use strict';
const createError = require('http-errors');
const token = require('./token');
const User = require('../db/models/user');

module.exports = async function authMiddleWare(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return next(createError(401, 'Unauthorized'));
  }
  const [, accessToken] = /Bearer (.+)/.exec(authHeader) || [];
  try {
    const encoded = await token.verify(accessToken);
    const user = await User.findOne({_id: encoded._id});
    user && (req.userData = {_id: user._id, account: user.account, balance: user.balance});
    user ?  next() : next(createError(401, 'Unauthorized'));
  } catch (error) {
    console.error(error);
    return next(createError(401, 'Unauthorized'));
  }
};
