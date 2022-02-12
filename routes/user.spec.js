const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

// TODO : test시, auth.checkToken 삭제해야함
describe('GET /users/', () => {
  describe('성공시', () => {
    it('success true를 반환한다.', done => {
      request(app)
        .get('/api/users')
        .expect(200)
        .end((_, res) => {
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
});

describe('GET /users/info/:id', () => {
  describe('성공시', () => {
    it('success true를 반환한다.', done => {
      request(app)
        .get('/api/users/info/1')
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
  describe('실패시', () => {
    it('존재하지 않는 idx일 경우 404을 응답한다.', done => {
      request(app)
        .get('/api/users/info/1000')
        .expect(404)
        .end((_, res) => {
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
});
