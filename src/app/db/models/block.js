const mongoose = require('mongoose');
const crypto = require('crypto');

const {Types: mongooseTypes} = mongoose.Schema;

const blockSchema = new mongoose.Schema({
  index: {
    type: mongooseTypes.Number,
    index: true,
    unique: true,
    default: 0
  },
  createdAt: mongooseTypes.Date,
  hash: {
    type: mongooseTypes.String,
    index: true,
    unique: true
  },
  data: {
    proof: mongooseTypes.Number
  },
  previousHash: mongooseTypes.String
});

blockSchema.pre('save', function (next) {
  try {
    this.createdAt = Date.now();
    const hashData  = `${this.index}.${this.createdAt}.${this.data.proof}.${this.previousHash}`;
    this.hash = crypto.createHash('sha256').update(hashData).digest('hex').toString();
    next();
  } catch (err) {
    next(err);
  }
});

const Block = mongoose.model('Block', blockSchema, 'blockChain');

module.exports = Block;

Object.assign(Block, {
  findLast() {

    return this.findOne({}).sort({index: -1});
  }
});

