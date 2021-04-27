import { AssertionError } from 'assert';
import Express from 'express';
import { IErrorLogger, IWarnLogger } from './interfaces';
import { NotFoundError } from './utils/NotFoundError';

export const handleErrors = ({ logger }: { logger: IWarnLogger & IErrorLogger }) => (
  err: Error,
  req: Express.Request,
  res: Express.Response,
  next: any, // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
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
