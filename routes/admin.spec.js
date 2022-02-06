const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

// TODO : test시, auth.checkToken 삭제해야함
describe('POST /admins/join', () => {
  // TODO: test시, newAdminUser 삭제해야함
  describe('성공시', () => {
    it('success true를 반환한다.', done => {
      request(app)
        .post('/api/admins/join')
        .send({
          email: 'newAdminUser',
          password: '12345',
          name: 'newAdminUser',
        })
        .expect(201)
        .end((_, res) => {
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('이미 존재하는 email일 경우, 409을 응답한다.', done => {
      request(app)
        .post('/api/admins/join')
        .send({
          email: 'existed',
          password: '123123',
          name: 'jonahyun',
        })
        .expect(409)
        .end((_, res) => {
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
    it('이미 존재하는 name일 경우, 409을 응답한다.', done => {
      request(app)
        .post('/api/admins/join')
        .send({
          email: 'newAdminUser1',
          password: '123123',
          name: 'existed',
        })
        .expect(409)
        .end((_, res) => {
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
});

describe('PATCH /admins/password', () => {
  describe('성공시', () => {
    it('success true를 반환한다.', done => {
      request(app)
        .patch('/api/admins/password/23')
        .send({
          beforePassword: '12345',
          newPassword: '123123',
          confirmPassword: '123123',
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('비밀번호 확인이 일치하지 않을 경우, 400을 응답한다.', done => {
      request(app)
        .patch('/api/admins/password/23')
        .send({
          beforePassword: '123123',
          newPassword: '123123',
          confirmPassword: '123124',
        })
        .expect(400)
        .end((_, res) => {
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
    it('존재하지 않는 idx일 경우 404을 응답한다.', done => {
      request(app)
        .patch('/api/admins/password/999')
        .send({
          beforePassword: '999999',
          newPassword: '12345',
          confirmPassword: '12345',
        })
        .expect(404)
        .end((_, res) => {
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
    it('잘못된 비밀번호일 경우 400를 응답한다.', done => {
      request(app)
        .patch('/api/admins/password/23')
        .send({
          beforePassword: '999999',
          newPassword: '12345',
          confirmPassword: '12345',
        })
        .expect(400)
        .end((_, res) => {
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('api 데이터 원상 복구', () => {
    it('비밀번호 원래대로', done => {
      request(app)
        .patch('/api/admins/password/23')
        .send({
          beforePassword: '123123',
          newPassword: '12345',
          confirmPassword: '12345',
        })
        .expect(200)
        .end((_, res) => {
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
});
