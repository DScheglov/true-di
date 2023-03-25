import { AsyncLocalStorage } from 'async_hooks';

const diAsyncContext = new AsyncLocalStorage();

const get = <T>() => diAsyncContext.getStore() as T;

const run = <T, R>(context: T, cb: () => R) => {
  diAsyncContext.enterWith(context);
  return cb();
};

export default { get, run };
