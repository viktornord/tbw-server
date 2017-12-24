const {omit: _omit} = require('lodash');
const createError = require('http-errors');
const router = require('express').Router();

const User = require('../db/models/user');
const auth = require('../auth');

router.post('/token', tokenPOST);

module.exports = router;

async function tokenPOST(req, res, next) {
  try {
    const {email, password} = req.body;
    const user = await User.findUserByEmail(email);
    if (user && await auth.crypt.verifyPassword(password, user.password)) {
      const accessToken = await auth.token.sign({id: user._id});
      return res.send({accessToken, user: _omit(user, ['password'])});
    }
    next(createError(401, 'Unauthorized'));
  } catch (error) {
    next(error);
  }
}
