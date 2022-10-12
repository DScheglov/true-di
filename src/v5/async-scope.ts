import { AnyModule, Resolver } from './types';
import { withLifeCycle } from './withLifeCycle';

export interface ContextProvider<T> {
  run(context: T, callback: () => any): void;
  get(): T;
}

let _contextProvider: ContextProvider<WeakMap<any, any>> =
  typeof window === 'undefined'
    ? require('./als-context-provider').default
    : require('./sync-context-provider').default;

export const initAsyncContextProvider = (
  asyncContextProvider: ContextProvider<WeakMap<any, any>>,
) => {
  _contextProvider = asyncContextProvider;
};

const contextProvider = (): ContextProvider<WeakMap<any, any>> => _contextProvider;

export const run = (cb: () => void) => contextProvider().run(new WeakMap(), cb);

export const asyncScope = <IntD extends AnyModule, ExtD extends AnyModule, T>(
  resolver: Resolver<IntD, ExtD, T>,
  initial?: [any, T],
) => {
  if (initial) contextProvider().get().set(resolver, initial[0]);

  return withLifeCycle((internal: IntD, external: ExtD): T => {
    const cache = contextProvider().get();
    const result = cache.get(resolver);

    if (result != null) return result.instance;

    const instance = resolver(internal, external);

    cache.set(resolver, { instance });

    return instance;
  }, 'async');
};
