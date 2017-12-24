const mongoose = require('mongoose');

const {Types: mongooseTypes} = mongoose.Schema;

const transactionSchema = new mongoose.Schema({
  from: mongooseTypes.String,
  to: mongooseTypes.String,
  amount: mongooseTypes.Number
});


transactionSchema.post('save', async function(transaction, next) {
  try {
    console.log(`New transaction. From ${transaction.from} to ${transaction.to} for amount ${transaction.amount}`);
    next();
  } catch (err) {
    next(err);
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
