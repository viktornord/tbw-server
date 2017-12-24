const {ObjectID} = require('mongodb');
const supertest = require('supertest');
const crypto = require('crypto');

const token = require('../src/auth/token');
const User = require('../src/db/models/user');

const request = supertest(`http://localhost:${process.env.PORT}/v1`);

describe('user-spec', () => {
  afterEach(async () => {
    await User.remove({});
  });

  it('should create a new user successfully', async () => {
    const user = {
      email: 'test@test.com',
      password: 'test'
    };
    const res = await request.post('/users').send(user);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      accessToken: jasmine.any(String),
      user: {
        _id: jasmine.any(String)
      }
    });
    const _id = ObjectID(res.body.user._id);
    expect(res.body.hasOwnProperty('password')).toBe(false);
    expect((await User.findOne({_id})).toObject()).toEqual({
      _id,
      email: user.email,
      account: jasmine.any(String),
      password: jasmine.any(String),
      balance: 0,
      __v: jasmine.any(Number)
    })
  });

  it('should fail creating a new user with email that already exists in DB', async () => {
    const user = {
      email: 'test@test.com',
      password: 'test'
    };
    await new User(user).save();
    const res = await request.post('/users').send({
      email: 'test@test.com',
      password: 'test'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(jasmine.any(String));
  });

  it('should get user by id', async () => {
    const user = await new User({
      email: 'test@test.com',
      password: crypto.pbkdf2Sync('test', process.env.TBW_SALT, 10, 64, 'sha512').toString('hex'),
      account: '1234'
    }).save();
    const authHeader = `Bearer ${await token.sign({_id: user._id})}`;
    const res = await request.get(`/users/${user._id}`).set('Authorization', authHeader);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      _id: user._id.toString(),
      email: user.email,
      account: jasmine.any(String),
      balance: 0,
      __v: jasmine.any(Number)
    })
  });
});