import { decorated } from './decorated';
import { MODULE } from './life-cycle';
import { Resolver } from './types';

export const moduleScopeMemo = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  resolver: Resolver<PrM, PbM, ExtD, T>,
  initial?: [PrM & PbM, T],
): Resolver<PrM, PbM, ExtD, T> => {
  const cache = new WeakMap<PrM, T>(initial != null ? [initial] : []);

  return (internal: PrM & PbM, external: ExtD) => {
    if (cache.has(internal)) return cache.get(internal)!;
    const instance = resolver(internal, external);
    cache.set(internal, instance);
    return instance;
  };
};

export const moduleScope = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  resolver: Resolver<PrM, PbM, ExtD, T>,
  initial?: [PrM & PbM, T],
  force: boolean = true,
): Resolver<PrM, PbM, ExtD, T> => decorated(
    moduleScopeMemo(resolver, initial),
    resolver,
    'moduleScope',
    MODULE,
    force,
  );
