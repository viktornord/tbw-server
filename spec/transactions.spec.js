const {ObjectID} = require('mongodb');
const crypto = require('crypto');
const supertest = require('supertest');
const token = require('../src/auth/token');
const User = require('../src/db/models/user');
const Transaction = require('../src/db/models/transaction');

const request = supertest(`http://localhost:${process.env.PORT}/v1`);

describe('transaction-spec', () => {
  let users, authHeader;

  beforeAll(async () => {
    users = await User.create([
      {
        email: 'test@test.com',
        password: crypto.pbkdf2Sync('test', process.env.TBW_SALT, 10, 64, 'sha512').toString('hex'),
        account: '123',
        balance: 10
      },
      {
        email: 'test2@test.com',
        password: crypto.pbkdf2Sync('test', process.env.TBW_SALT, 10, 64, 'sha512').toString('hex'),
        account: '456',
        balance: 20
      }
    ]);
    authHeader = `Bearer ${await token.sign({_id: users[0]._id})}`;
  });

  afterAll(async () => {
    await User.remove({});
  });

  afterEach(async () => {
    await Transaction.remove({});
    await User.update({}, {$set: {balance: 0}}, {multi: true});
  });

  it('should create a new transaction from one user ot another & update corresponding balances', async () => {
    const amount = 10;
    const res = await request.post('/transactions').set('Authorization', authHeader).send({to: users[1].account, amount});
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      _id: jasmine.any(String),
      __v: jasmine.any(Number),
      from: users[0].account,
      to: users[1].account,
      amount
    });
    expect((await User.findOne({_id: users[0]._id})).balance).toBe(users[0].balance - amount);
    expect((await User.findOne({_id: users[1]._id})).balance).toBe(users[1].balance + amount);
    expect((await Transaction.find({})).map(item => item.toObject())).toEqual([{
      _id: jasmine.any(ObjectID),
      __v: jasmine.any(Number),
      from: users[0].account,
      to: users[1].account,
      amount
    }]);
  });

  it('should fail creating a new transaction due to invalid amount', async () => {
    const res = await request.post('/transactions').set('Authorization', authHeader).send({to: users[1].account, amount: 0});
    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(jasmine.any(String));
  });

  it('should fail creating a new transaction if destination account does not exist', async () => {
    const res = await request.post('/transactions').set('Authorization', authHeader).send({to: 'foo', amount: 10});
    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(jasmine.any(String));
  });

  it('should fail creating a new transaction if destination account is the same as sender account', async () => {
    const res = await request.post('/transactions').set('Authorization', authHeader).send({to: users[0].account, amount: 10});
    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(jasmine.any(String));
  });

  it('should get transaction list', async () => {
    const transactions = [
      {from: users[0].account, to: 'b', amount: 1},
      {from: 'b', to: 'c', amount: 2},
      {from: 'd', to: users[0].account, amount: 3},
      {from: users[0].account, to: 'e', amount: 3},
      {from: 'a', to: 'd', amount: 3},
      {from: 'Network', to: users[0].account, amount: 3},
    ];
    const expectedTransactions = [transactions[0], transactions[2], transactions[3], transactions[5]];
    for (let idx = 0; idx < transactions.length; idx++) {
      await new Transaction(transactions[idx]).save();
    }
    const res = await request.get('/transactions').set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {_id: jasmine.any(String), __v: jasmine.any(Number), ...expectedTransactions[0]},
      {_id: jasmine.any(String), __v: jasmine.any(Number), ...expectedTransactions[1]},
      {_id: jasmine.any(String), __v: jasmine.any(Number), ...expectedTransactions[2]},
      {_id: jasmine.any(String), __v: jasmine.any(Number), ...expectedTransactions[3]},
    ]);
  })
});
