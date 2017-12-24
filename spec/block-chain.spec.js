const {ObjectID} = require('mongodb');
const crypto = require('crypto');
const supertest = require('supertest');
const token = require('../src/auth/token');
const User = require('../src/db/models/user');
const Transaction = require('../src/db/models/transaction');

const request = supertest(`http://localhost:${process.env.PORT}/v1`);

describe('block-chain-spec', () => {
  let user, authHeader;

  beforeAll(async () => {
    user = await new User({
      email: 'test@test.com',
      password: crypto.pbkdf2Sync('test', process.env.TBW_SALT, 10, 64, 'sha512').toString('hex')
    }).save();
    authHeader = `Bearer ${await token.sign({_id: user._id})}`;
  });

  afterAll(async () => {
    await User.remove({});
    await Transaction.remove({});
  });

  describe('mining new coin', () => {
    let res;
    beforeAll(async () => {
      res = await request.get('/block-chain/mine').set('Authorization', authHeader);
    });

    it('should respond with a new block', () => {
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        _id: jasmine.any(String),
        __v: jasmine.any(Number),
        index: jasmine.any(Number),
        createdAt: jasmine.any(String),
        hash: jasmine.any(String),
        data: {
          proof: jasmine.any(Number)
        },
        previousHash: jasmine.any(String)
      });
    });

    it('should update user balance', async () => {
      expect((await User.findOne({_id: user._id})).balance).toBe(user.balance + 1);
    });

    it('should create a new transaction from network to user', async () => {
      expect((await Transaction.getUserTransactions(user.account)).map(item => item.toObject())).toEqual([{
        _id: jasmine.any(ObjectID),
        __v: jasmine.any(Number),
        from: 'Network',
        to: user.account,
        amount: 1
      }]);
    });
  });
});
