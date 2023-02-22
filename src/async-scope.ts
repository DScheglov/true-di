import { decorated } from './decorated';
import { ASYNC } from './life-cycle';
import { Resolver } from './types';

export interface ContextProvider<T> {
  run(context: T, callback: () => any): void;
  get(): T;
}

let _contextProvider: ContextProvider<WeakMap<any, any>> =
  (global as any).window !== global
    ? require('./als-context-provider').default
    : require('./sync-context-provider').default;

export const initAsyncContextProvider = (
  asyncContextProvider: ContextProvider<WeakMap<any, any>>,
) => {
  _contextProvider = asyncContextProvider;
};

const contextProvider = (): ContextProvider<WeakMap<any, any>> => _contextProvider;

export const run = (cb: () => void) => contextProvider().run(new WeakMap(), cb);

export const asyncScope = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  resolver: Resolver<PrM, PbM, ExtD, T>,
  initial?: [any, T],
  force: boolean = true,
): Resolver<PrM, PbM, ExtD, T> => {
  if (initial) contextProvider().get().set(resolver, initial[1]);

  return decorated(
    (internal: PrM & PbM, external: ExtD): T => {
      const cache = contextProvider().get();

      if (cache.has(resolver)) return cache.get(resolver);

      const instance = resolver(internal, external);

      cache.set(resolver, instance);

      return instance;
    },
    resolver,
    'asyncScope',
    ASYNC,
    force,
  );
};

asyncScope.run = run;
