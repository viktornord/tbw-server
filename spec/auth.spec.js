const crypto = require('crypto');
const supertest = require('supertest');
const User = require('../src/db/models/user');

const request = supertest(`http://localhost:${process.env.PORT}/v1`);

describe('auth-spec', () => {
  let user;

  beforeAll(async () => {
    user = {
      _id: '5a3faf8368be0a71dc7ffacc',
      email: 'test@test.com',
      password: crypto.pbkdf2Sync('test', process.env.TBW_SALT, 10, 64, 'sha512').toString('hex')
    };
    await new User(user).save();
  });

  afterAll(async () => {
    await User.remove({});
  });

  it('should retrieve token', async () => {
    const res = await request.post(`/auth/token`).send({email: user.email, password: 'test'});
    expect(res.status).toBe(200);
    expect(res.body.accessToken).toEqual(jasmine.any(String));
    expect(res.body.user).toEqual({_id: user._id});
  });

  it('should respond with 401 error if password is wrong', async () => {
    const res = await request.post(`/auth/token`).send({email: user.email, password: 'xxx'});
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual(jasmine.any(String));
  });

  it('should respond with 401 error if user with specified email does not exist', async () => {
    const res = await request.post(`/auth/token`).send({email: 'xxx', password: 'test'});
    expect(res.status).toBe(401);
    expect(res.body.message).toEqual(jasmine.any(String));
  });
});
