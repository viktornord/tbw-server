const router = require('express').Router();

const authMiddleware = require('../auth/auth-middleware');
const User = require('../db/models/user');
const auth = require('../auth');

router.post('/users', userPOST);
router.get('/users/:id', authMiddleware, userByIdGET);

module.exports = router;

async function userByIdGET(req, res, next) {
  try {
    const {id} = req.params;
    const user = await User.findUserById(id);
    user ? res.send(user) : next();
  } catch (error) {
    next(error);
  }
}

async function userPOST(req, res, next) {
  try {
    const {email, password} = req.body;
    if (await User.isUserExist(email)) {

      return next({status: 400, message: 'User with such an email already exists'});
    }
    const user = await User.create({
      email,
      password: await auth.crypt.encryptPassword(password)
    });
    const userInfo = {_id: user._id};
    const accessToken = await auth.token.sign(userInfo);

    return res.send({accessToken, user: userInfo});
  } catch (error) {
    next(error);
  }
}
