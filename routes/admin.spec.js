const request = require('supertest');
const { expect } = require('chai');
const app = require('../index');

// TODO : test시, auth.checkToken 삭제해야함
describe('POST /admins/join', () => {
  // TODO : 테스트시 새로운 데이터로 교체
  // describe('성공시', () => {
  //   const adminUser = {
  //     email: 'abcdeF',
  //     password: '12345',
  //     name: 'abcdef',
  //   };
  //   it('success true를 반환한다.', done => {
  //     request(app)
  //       .post('/api/admins/join')
  //       .send(adminUser)
  //       .expect(201)
  //       .end((err, res) => {
  //         expect(res.body).to.have.property('success', true);
  //         done();
  //       });
  //   });
  // });
  describe('실패시', () => {
    it('이미 등록된 email일 경우 409를 응답한다.', done => {
      request(app)
        .post('/api/admins/join')
        .send({
          email: 'abcd',
          password: '12345',
          name: '콩순이',
        })
        .expect(409)
        .end(done);
    });
    it('이미 등록된 name일 경우 409를 응답한다.', done => {
      request(app)
        .post('/api/admins/join')
        .send({
          email: 'hrrrr',
          password: '12345',
          name: 'abced',
        })
        .expect(409)
        .end(done);
    });
  });
});

describe('PATCH /admins/password', () => {
  describe('성공시', () => {
    const adminUser = {
      beforePassword: '12345',
      newPassword: '123123',
      confirmPassword: '123123',
    };
    it('success true를 반환한다.', done => {
      request(app)
        .patch('/api/admins/password/23')
        .send(adminUser)
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
        .end(done);
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
        .end(done);
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
        .end(done);
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
        .end(done);
    });
  });
});
