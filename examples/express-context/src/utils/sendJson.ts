import Express from 'express';

export const sendJson = (res: Express.Response) => (data: object) =>
  res
    .type('application/json')
    .send(JSON.stringify(data, null, 2));
