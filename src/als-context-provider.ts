import { AsyncLocalStorage } from 'async_hooks';

const diAsyncContext = new AsyncLocalStorage();

const get = <T>() => diAsyncContext.getStore() as T;

const run = <T>(context: T, cb: () => void) => diAsyncContext.run(context, cb);

export default { get, run };
