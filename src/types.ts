export type IInstanceInitializer<IContainer, N extends keyof IContainer> = (
  instance: IContainer[N],
  container: IContainer,
  name: N,
) => void;

export type VoidFn = () => void;

export type IFactory <IContainer, N extends keyof IContainer> =
  (container: IContainer) => IContainer[N]

export type IFactoryTuple<IContainer, N extends keyof IContainer> =
  [IFactory<IContainer, N>, IInstanceInitializer<IContainer, N>];

export type IFactories<IContainer extends object> = {
  [name in keyof IContainer]:
    IFactory<IContainer, name> | IFactoryTuple<IContainer, name>
}

export type IPureFactories<C> = {
  [name in keyof C]: () => C[name]
}
