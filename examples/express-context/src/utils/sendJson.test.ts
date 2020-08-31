import Express from 'express';
import { sendJson } from './sendJson';

function returnThis() { return this; }

const fakeResponse: Express.Response = {
  type: jest.fn(returnThis),
  send: jest.fn(returnThis),
} as any;

describe('Utils.sendJson', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('stringifies object to JSON and sends via res.send', () => {
    sendJson(fakeResponse)({ title: 'The Title' });

    expect(fakeResponse.type).toHaveBeenCalledWith('application/json');
    expect(fakeResponse.send).toHaveBeenCalledWith(
      JSON.stringify({ title: 'The Title' }, null, 2),
    );
  });
});
