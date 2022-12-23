import { describe, it } from '@jest/globals';
import request from 'supertest';
import app from '.';

describe('Express App', () => {
  it('responds with 200 on /featured-products', done => {
    request(app)
      .get('/featured-products')
      .send()
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
