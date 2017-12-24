const Transaction = require('../db/models/transaction');
const User = require('../db/models/user');
const authMiddleWare = require('../auth/auth-middleware');
const router = require('express').Router();

router.post('/transactions', authMiddleWare, transactionPOST);

router.get('/transactions', authMiddleWare, transactionListGET);

module.exports = router;

async function transactionPOST(req, res, next) {
  const {amount, to} = req.body;
  const transaction = await new Transaction({
    from: req.userData.account,
    amount,
    to
  }).save();
  await User.updateBalance(req.userData._id, -transaction.amount);

  res.send(transaction);
}
async function transactionListGET(req, res, next) {
  try {
    const transactions = await Transaction.getUserTransactions(req.userData.account);
    res.send(transactions);
  } catch (err) {
    next(err);
  }
}