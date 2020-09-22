import { AssertionError } from 'assert';
import { NotFoundError } from './utils/NotFoundError';

export const handleErrors = (err: Error): [number, { error: string}] | null =>
  err instanceof AssertionError
    ? [400, { error: err.message }] :
  err instanceof NotFoundError
    ? [404, { error: err.message }] :
  null;
