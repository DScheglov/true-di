export type Token = string | symbol;

export type AnyModule = { [token in Token]: any; }

export type LifeCycle = 'transient' | 'async' | 'module' | 'singleton';

export type Resolver<IntD extends AnyModule, ExtD extends AnyModule, T> = {
  (internal: IntD, extenal: ExtD): T;
  lifeCycle?: LifeCycle;
}

export type Resolvers<
  M extends AnyModule,
  IntD extends AnyModule,
  ExtD extends AnyModule
> = {
  [token in keyof M]: Resolver<IntD, ExtD, M[token]>
};
