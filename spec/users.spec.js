const {ObjectID} = require('mongodb');
const supertest = require('supertest');

const User = require('../src/db/models/user');

const request = supertest(`http://localhost:${process.env.PORT}/v1`);

describe('user-spec', () => {
  beforeEach(async () => {
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
});