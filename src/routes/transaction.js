const createError = require('http-errors');
const Transaction = require('../db/models/transaction');
const User = require('../db/models/user');
const authMiddleWare = require('../auth/auth-middleware');
const router = require('express').Router();

router.post('/transactions', authMiddleWare, transactionPOST);

router.get('/transactions', authMiddleWare, transactionListGET);

module.exports = router;

async function transactionPOST(req, res, next) {
  try {
    const {amount, to: destinationAccount} = req.body;
    if (destinationAccount === req.userData.account) {

      return next(createError(400, 'You cannot transfer coins to yourself'));
    }
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) {

      return next(createError(400, 'Not valid amount'));
    }
    if (! await User.isAccountExist(destinationAccount)) {

      return next(createError(400, 'Destination account does not exist'));
    }
    await User.updateBalance(destinationAccount, amount);
    await User.updateBalance(req.userData.account, -amount);
    const transaction = await new Transaction({
      from: req.userData.account,
      amount,
      to: destinationAccount
    }).save();

    res.send(transaction);
  } catch (err) {
    next(err);
  }
}
async function transactionListGET(req, res, next) {
  try {
    const transactions = await Transaction.getUserTransactions(req.userData.account);
    res.send(transactions);
  } catch (err) {
    next(err);
  }
}