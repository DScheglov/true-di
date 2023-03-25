import { decorated } from './decorated';
import { SINGLETON } from './life-cycle';
import { Resolver } from './types';
import { ItemResolver } from './module-types';
import mapObject from './utils/map-object';

export const singleton = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  resolver: Resolver<PrM, PbM, ExtD, T>,
): Resolver<PrM, PbM, ExtD, T> => {
  let result: { instance: T } | null = null;
  return decorated(
    (internal: PrM & PbM, external: ExtD) => {
      if (result) return result.instance;

      const instance = resolver(internal, external);

      result = { instance };

      return instance;
    },
    resolver,
    'singleton',
    SINGLETON,
    true,
    singleton,
  );
};

export const singletonW =
  <
    // eslint-disable-next-line no-use-before-define
    Token extends Exclude<string | symbol, keyof (PrM & PbM)>,
    PrM extends {},
    PbM extends {},
    ExtD extends {},
    T
  >(items: ItemResolver<PrM, PbM, Token, ExtD, T>): ItemResolver<PrM, PbM, Token, ExtD, T> =>
    mapObject(items, token => singleton(items[token] as any));
