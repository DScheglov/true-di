import { AssertionError } from 'assert';
import Express from 'express';
import { IErrorLogger, IWarnLogger } from './interfaces';
import { Injected } from './interfaces/IRequestInjected';
import { NotFoundError } from './utils/NotFoundError';

export const handleErrors = (
  err: Error,
  { injected: { logger } }: Injected<{ logger: IWarnLogger & IErrorLogger }>,
  res: Express.Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: any, // Express requires function with arity 4
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
