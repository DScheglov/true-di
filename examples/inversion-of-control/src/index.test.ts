import request from 'supertest';
import app from '.';

describe('Express App', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('responds with 200 on /orders', done => {
    request(app)
      .get('/orders')
      .send()
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
