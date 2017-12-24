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
      const userInfo = {_id: user._id};
      const accessToken = await auth.token.sign(userInfo);
      return res.send({accessToken, user: userInfo});
    }
    next(createError(401, 'Unauthorized'));
  } catch (error) {
    next(error);
  }
}
