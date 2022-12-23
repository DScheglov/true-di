/* eslint-disable no-use-before-define */
import { AnyReaders, BoundReaders } from './reader-types';
import {
  ExtendedResolver,
  Initializers, Resolver, Resolvers, ScopeDecorator,
} from './types';

export type ExcludeKeys<T extends {}> = Exclude<string | symbol, keyof T>;

export type StrictFunctionDecorator = {
  <Args extends any[], R>(fn: (...args: Args) => R): (...args: Args) => R;
};

export type ExpositionSelector<Items extends {}, T> = {
  (items: Items): T;
};
export type ItemResolver<
  PrM extends {},
  PbM extends {},
  Token extends ExcludeKeys<PbM & PrM>,
  Params extends {},
  T
> = {
    [key in Token]: Resolver<PrM, PbM, Params, T>;
  };

export type ExtItemResolver<
  PrM extends {},
  PbM extends {},
  Token extends ExcludeKeys<PbM & PrM>,
  Params extends {},
  T,
  Extra extends any[] = []
> = {
    [key in Token]: ExtendedResolver<PrM, PbM, Params, T, Extra>;
  };

export type ProtoModule<PrM extends {}, PbM extends {}, ExtD extends {}> = {
  privateResolvers: Resolvers<PrM, PrM, PbM, ExtD>;
  publicResolvers: Resolvers<PbM, PrM, PbM, ExtD>;
  initializers: Initializers<PrM & PbM, ExtD>;
  selector: ExpositionSelector<PrM & PbM, any> | null;
  memoizer: StrictFunctionDecorator | null;
};

export type Creatable<
  PbM,
  ExtD extends {},
  EmptyResult extends boolean = [keyof PbM] extends [never] ? true : false
> =
  EmptyResult extends true ? {} :
  [keyof ExtD] extends [never] ? { create(): PbM; } :
  { create(params: ExtD): PbM; };

export type ManagebleCreate<
  PbM,
  ExtD extends {},
  EmptyResult extends boolean = [keyof PbM] extends [never] ? true : false
> =
  & Creatable<PbM, ExtD>
  & {
    singleton: () => Creatable<PbM, ExtD, EmptyResult>;
  }
  & (
    [keyof ExtD] extends [never]
      ? {}
      : { memo(getMemoKey: (params: ExtD) => any): Creatable<PbM, ExtD, EmptyResult>; }
  );

export type Exposible<PrM extends {}, PbM extends {}, ExtD extends {}> = {
  expose<T>(selector: ExpositionSelector<PrM & PbM, T>): ManagebleCreate<T, ExtD, false>;
  useCases<Thunks extends AnyReaders<PrM & PbM>>(
    thunks: Thunks
  ): ManagebleCreate<BoundReaders<Thunks>, ExtD>;
};

export type Extendable<PrM extends {}, PbM extends {}, ExtD extends {}> = {
  private<Token extends ExcludeKeys<PbM & PrM>, Params extends {}, T>(
    items: ItemResolver<PrM, PbM, Token, Params, T>
  ): ModuleBuilder<PrM & { [key in Token]: T }, PbM, Params & ExtD>;

  private<
    Token extends ExcludeKeys<PbM & PrM>,
    Params extends {},
    T,
    DP extends {} = {},
    Extra extends any[] = []
  >(
    scopeDecorator: ScopeDecorator<PrM, PbM, ExtD, T, DP, Extra>,
    items: ExtItemResolver<PrM, PbM, Token, Params, T, Extra>
  ): ModuleBuilder<PrM & { [key in Token]: T }, PbM, Params & ExtD & DP>;

  public<Token extends ExcludeKeys<PbM & PrM>, Params extends {}, T>(
    items: ItemResolver<PrM, PbM, Token, Params, T>
  ): ModuleBuilder<PrM, PbM & { [key in Token]: T }, Params & ExtD>;

  public<
    Token extends ExcludeKeys<PbM & PrM>,
    Params extends {},
    T,
    DP extends {} = {},
    Extra extends any[] = []
  >(
    scopeDecorator: ScopeDecorator<PrM, PbM, ExtD, T, DP, Extra>,
    items: ExtItemResolver<PrM, PbM, Token, Params, T, Extra>
  ): ModuleBuilder<PrM, PbM & { [key in Token]: T }, Params & ExtD & DP>;
};

export type Initable<PrM extends {}, PbM extends {}, ExtD extends {}> = {
  init(
    initializers: Initializers<PrM & PbM, ExtD
  >): ManagebleCreate<PbM, ExtD> & Exposible<PrM, PbM, ExtD>;
}

export type ModuleBuilder<PrM extends {}, PbM extends {}, ExtD extends {}> =
  & Extendable<PrM, PbM, ExtD>
  & Initable<PrM, PbM, ExtD>
  & Exposible<PrM, PbM, ExtD>
  & ManagebleCreate<PbM, ExtD>;
