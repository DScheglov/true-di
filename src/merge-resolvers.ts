import { shallowMerge } from './utils/shallow-merge';
import { Resolvers, Resolver } from './types';

export const mergeResolvers = <
  M extends {},
  PrM extends {},
  PbM extends {},
  ExtD extends {},
  Token extends Exclude<(string | symbol), keyof PrM>,
  T,
  Params extends {}
>(
    resolvers: Resolvers<M, PrM, PbM, ExtD>,
    items: { [key in Token]: Resolver<PrM, PbM, Params, T> },
  ):
    M extends PrM
      ? Resolvers<
          PrM & { [key in Token]: T },
          PrM & { [key in Token]: T },
          PbM,
          ExtD & Params
        >
      : Resolvers<
          PbM & { [key in Token]: T },
          PrM,
          PbM & { [key in Token]: T },
          ExtD & Params
        > =>
    shallowMerge(resolvers, items) as any;
