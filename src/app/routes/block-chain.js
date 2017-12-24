const router = require('express').Router();
const Block = require('../db/models/block');
const Transaction = require('../db/models/transaction');
const User = require('../db/models/user');
const authMiddleWare = require('../auth/auth-middleware');
const {proofOfWork} = require('../lib/helpers');

router.get('/block-chain/mine', authMiddleWare, mineCoinGET);

module.exports = router;

async function mineCoinGET(req, res, next) {
  try {
    const lastBlock = await Block.findLast();
    // mining...
    const proof = proofOfWork(lastBlock ? lastBlock.data.proof : 1);
    // perform a new transaction
    await new Transaction({
      from: 'Network',
      to: req.userData.account,
      amount: 1
    }).save();
    // update block chain
    const block = await new Block({
      data: {proof},
      index: lastBlock ? lastBlock.index + 1 : 0,
      previousHash: lastBlock ? lastBlock.hash : ''
    }).save();
    // update user balance with mined coin
    await User.updateBalance(req.userData._id, 1);
    res.send(block);
  } catch(err) {
    next(err);
  }
}