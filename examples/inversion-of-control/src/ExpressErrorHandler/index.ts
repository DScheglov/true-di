import { AssertionError } from 'assert';
import Express from 'express';
import { IErrorLogger, IWarnLogger } from '../interfaces';
import { NotFoundError } from '../utils/NotFoundError';

export const handleErrors = (
  err: Error,
  req: Express.Request,
  res: Express.Response,
  next: any, // eslint-disable-line @typescript-eslint/no-unused-vars
) => ({ logger }: { logger: IWarnLogger & IErrorLogger }) => {
  console.log({
    err, res, req, next,
  });
  const statusCode =
    err instanceof AssertionError ? 400 :
    err instanceof NotFoundError ? 404 :
    500;

  if (statusCode === 500) {
    logger.error(err);
    res.status(statusCode).json({ error: 'Internal Server Error' });
    return;
  }

  logger.warn(err.message);
  res.status(statusCode).json({ error: err.message });
};
