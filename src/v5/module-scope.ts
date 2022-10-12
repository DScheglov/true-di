import { AnyModule, Resolver } from './types';
import { withLifeCycle } from './withLifeCycle';

export const moduleScopeMemo = <IntD extends AnyModule, ExtD extends AnyModule, T>(
  resolver: Resolver<IntD, ExtD, T>,
  initial?: [IntD, T],
): Resolver<IntD, ExtD, T> => {
  const cache = new WeakMap<IntD, T>(initial != null ? [initial] : []);

  return (internal: IntD, external: ExtD) => {
    if (cache.has(internal)) return cache.get(internal)!;
    const instance = resolver(internal, external);
    cache.set(internal, instance);
    return instance;
  };
};

export const moduleScope = <IntD extends AnyModule, ExtD extends AnyModule, T>(
  resolver: Resolver<IntD, ExtD, T>,
  initial?: [IntD, T],
) => withLifeCycle(moduleScopeMemo(resolver, initial), 'module');
