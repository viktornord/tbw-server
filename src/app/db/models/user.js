const mongoose = require('mongoose');
const crypto = require('crypto');

const {Types: mongooseTypes} = mongoose.Schema;

const User = mongoose.model('User', new mongoose.Schema({
  email: { type: mongooseTypes.String, index: true, unique: true, lowercase: true} ,
  password: mongooseTypes.String,
  account: {
    type: mongooseTypes.String,
    default: createAccountAddress
  },
  balance: {
    type: mongooseTypes.Number,
    default: 0
  }
}));

module.exports = User;

Object.assign(User, {
  findUserByEmail(email) {

    return this.findOne({email});
  },
  async isUserExist(email) {

    return (await this.findOne({email}).count()) > 0;
  },

  findUserById(_id) {

    return this.findOne({_id}, {password: 0});
  },

  updateBalance(_id, coins) {

    return this.update({_id}, {$inc: {balance: coins}});
  }
});

function createAccountAddress() {

  return crypto.createHash('sha256').update(Math.random().toString()).digest('hex').toString();
}