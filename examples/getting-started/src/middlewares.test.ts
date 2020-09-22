import { AssertionError } from 'assert';
import Express from 'express';
import { IErrorLogger, IWarnLogger } from './interfaces';
import { handleErrors } from './middlewares';
import { NotFoundError } from './utils/NotFoundError';

function returnThis() { return this; }

const fakeResponse = (): Express.Response => ({
  status: jest.fn(returnThis),
  json: jest.fn(returnThis),
}) as any;

describe('handleErrors', () => {
  it('handles AssertionError: status = 400, warning: err.message, response: err.message', () => {
    const fakeLogger: IWarnLogger & IErrorLogger = {
      warn: jest.fn(),
      error: jest.fn(),
    };

    const res = fakeResponse();
    const next = jest.fn();
    const error = new AssertionError({ message: 'Something is wrong' });

    handleErrors(error, { injected: { logger: fakeLogger } }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(fakeLogger.warn).toHaveBeenCalledWith('Something is wrong');
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something is wrong' });
  });

  it('handles NotFoundError: status = 404, warning: err.message, response: err.message', () => {
    const fakeLogger: IWarnLogger & IErrorLogger = {
      warn: jest.fn(),
      error: jest.fn(),
    };

    const res = fakeResponse();
    const next = jest.fn();
    const error = new NotFoundError('Entity');

    handleErrors(error, { injected: { logger: fakeLogger } }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(fakeLogger.warn).toHaveBeenCalledWith('The Entity is not found.');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'The Entity is not found.' });
  });

  it('handles unrecognized error', () => {
    const fakeLogger: IWarnLogger & IErrorLogger = {
      warn: jest.fn(),
      error: jest.fn(),
    };

    const res = fakeResponse();
    const next = jest.fn();
    const error = new Error('Some Error');

    handleErrors(error, { injected: { logger: fakeLogger } }, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(fakeLogger.error).toHaveBeenCalledWith(error);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
