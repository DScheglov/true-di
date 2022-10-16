import { decorated } from './decorated';
import { SINGLETON } from './life-cycle';
import { Resolver } from './types';

export const singleton = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  resolver: Resolver<PrM, PbM, ExtD, T>,
): Resolver<PrM, PbM, ExtD, T> => {
  let result: { instance: T } | null = null;
  return decorated(
    (internal: PrM & PbM, extenal: ExtD) => {
      if (result) return result.instance;

      const instance = resolver(internal, extenal);

      result = { instance };

      return instance;
    },
    resolver,
    'singleton',
    SINGLETON,
    true,
  );
};
