import { LifeCycle } from './life-cycle';

export type { LifeCycle };

export type Resolver <PrM extends {}, PbM extends {}, ExtD extends {}, T> = {
  (internal: PrM & PbM, external: ExtD): T;
  lifeCycle?: LifeCycle;
  original?: (internal: PrM & PbM, external: ExtD) => T;
  force?: boolean;
}

export type Resolvers<
  M extends {},
  PrM extends {},
  PbM extends {},
  ExtD extends {}
> = {
  [token in keyof M]: Resolver<PrM, PbM, ExtD, M[token]>;
};

export type Initializer<
  IntD extends {},
  ExtD extends {},
  T extends keyof IntD,
> = {
  (instance: IntD[T], internalDeps: IntD, externalDeps: ExtD, token: T): void;
}

export type Initializers<
  IntD extends {}, // eslint-disable-line no-use-before-define
  ExtD extends {},
> = Partial<{
  [token in keyof IntD]: Initializer<IntD, ExtD, token>;
}>;

export type ExtendedResolver <
  PrM extends {},
  PbM extends {},
  ExtD extends {},
  T,
  Extra extends any[] = []
> = {
  (internal: PrM & PbM, external: ExtD, ...extra: Extra): T;
}
export type ScopeDecorator<
  PrM extends {},
  PbM extends {},
  ExtD extends {},
  T,
  Params extends {} = {},
  Extra extends any[] = [],
> ={
  (resolver: ExtendedResolver<PrM, PbM, ExtD, T, Extra>): Resolver<PrM, PbM, ExtD & Params, T>
}
