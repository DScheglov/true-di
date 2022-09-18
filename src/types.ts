export type IInstanceInitializer<S extends {}, P extends {}, N extends keyof S> = (
  instance: S[N],
  container: S,
  params: P,
  name: N,
) => void;

export type VoidFn = () => void;

export type IFactory <S extends {}, P extends {}, N extends keyof S> =
  (container: S, params: P) => S[N]

export type IFactoryTuple<S extends {}, P extends {}, N extends keyof S> =
  [IFactory<S, P, N>, IInstanceInitializer<S, P, N>];

export type IFactories<S extends object, P extends {} = {}> = {
  [name in keyof S]:
    IFactory<S, P, name> | IFactoryTuple<S, P, name>
}

export type IPureFactories<C> = {
  [name in keyof C]: () => C[name]
}

export type ContainerFactory<S extends {}, P extends {}> =
  [keyof P] extends [never] ? () => S : (params: P) => S;
