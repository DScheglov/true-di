import { decorated } from './decorated';
import { ASYNC } from './life-cycle';
import { Resolver } from './types';

export interface ContextProvider<T> {
  run<R>(context: T, callback: () => R): R;
  get(): T;
}

let contextProvider: ContextProvider<Map<any, any>> =
  typeof window === 'undefined'
    ? require('./als-context-provider').default
    : require('./sync-context-provider').default;

export const run = <R>(cb: () => R) => contextProvider.run(new Map(), cb);

export const initAsyncContextProvider = (
  asyncContextProvider: ContextProvider<Map<any, any>>,
) => {
  contextProvider = asyncContextProvider;
  run(() => {});
};

run.init = initAsyncContextProvider;

run(() => {});

export const asyncScope = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  resolver: Resolver<PrM, PbM, ExtD, T>,
  initial?: [any, T],
  force: boolean = true,
): Resolver<PrM, PbM, ExtD, T> => {
  if (initial) contextProvider.get().set(resolver, initial[1]);

  return decorated(
    (internal: PrM & PbM, external: ExtD): T => {
      const cache = contextProvider.get();

      if (cache == null) {
        console.warn('Async Context is not defined. Use scope.async.run to handle request with async di scope');
      }

      if (cache.has(resolver)) return cache.get(resolver);

      const instance = resolver(internal, external);

      cache.set(resolver, instance);

      return instance;
    },
    resolver,
    'asyncScope',
    ASYNC,
    force,
    asyncScope,
  );
};

asyncScope.run = run;
