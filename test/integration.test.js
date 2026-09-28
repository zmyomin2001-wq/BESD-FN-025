const request = require('supertest');
const { expect } = require('chai');
const app = require('../app');

describe('User Integration Tests', () => {

  // IT-1: 获取所有用户，排除密码
  it('IT-1: Should retrieve all users excluding userPassword', async () => {
    const res = await request(app).get('/users');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(3);
    expect(res.body[0]).to.not.have.property('userPassword');
  });

  // IT-2: 成功注册新用户
  it('IT-2: Should successfully register a new user', async () => {
    const newUser = {
      userEmail: 'newstudent@gmail.com',
      userPassword: 'password123',
      userFirstName: 'Test',
      userLastName: 'Student',
      userTel: '0812345678',
      dateOfBirth: '2000-01-01'
    };
    const res = await request(app).post('/users').send(newUser);
    expect(res.status).to.equal(201);
    expect(res.body.message).to.equal('Created');
  });

  // IT-3: 邮箱重复注册失败
  it('IT-3: Should fail registration when email already exists', async () => {
    const duplicateUser = {
      userEmail: 'daranporn@gmail.com',
      userPassword: 'password123'
    };
    const res = await request(app).post('/users').send(duplicateUser);
    expect([400, 409]).to.include(res.status);
  });

  // IT-4: 缺少必填字段注册失败
  it('IT-4: Should fail registration when missing mandatory fields', async () => {

    const incompleteUser = {
      userEmail: 'onlyemail@gmail.com'
    };
    const res = await request(app).post('/users').send(incompleteUser);
    expect(res.status).to.equal(400);
  });
});