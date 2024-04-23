import { Server } from 'http';
import app from '.';

describe('Express App', () => {
  const PORT = 11111;
  const HOST = 'localhost';
  const baseUrl = `http://${HOST}:${PORT}`;
  let server: Server;

  beforeAll(done => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    server = app.listen(PORT, HOST, done);
  });

  afterAll(() => {
    jest.restoreAllMocks();
    server?.close();
  });

  it('responds with 200 on /orders', async () => {
    const res = await fetch(`${baseUrl}/orders`);
    expect(res.status).toBe(200);
  });
});
