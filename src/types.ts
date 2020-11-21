/* eslint-disable max-len */
export type IInstanceInitializer<IContainer, N extends keyof IContainer> = (
  instance: IContainer[N],
  container: IContainer,
  name?: N,
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

export type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

export type KeysOfType<T, F> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { [Q in P]: F }, P>
}[keyof T];

export const expectStrictType = <expected>(value: expected): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const newValue: IfEquals<expected, typeof value, true> = true;
};

type Item<token extends string | symbol, T> = {
  [p in token]: T
}

export type Services<tokens extends (string|symbol)[], Deps extends any[]> =
  tokens extends [] ? {} :
  tokens extends [any] ?
    & Item<tokens[0], Deps[0]>
  :
  tokens extends [any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
  :
  tokens extends [any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
  :
  tokens extends [any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
  :
  tokens extends [any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
  :
  tokens extends [any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
  :
  tokens extends [any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
  :
  tokens extends [any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
    & Item<tokens[13], Deps[13]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
    & Item<tokens[13], Deps[13]>
    & Item<tokens[14], Deps[14]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
    & Item<tokens[13], Deps[13]>
    & Item<tokens[14], Deps[14]>
    & Item<tokens[15], Deps[15]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
    & Item<tokens[13], Deps[13]>
    & Item<tokens[14], Deps[14]>
    & Item<tokens[15], Deps[15]>
    & Item<tokens[16], Deps[16]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
    & Item<tokens[13], Deps[13]>
    & Item<tokens[14], Deps[14]>
    & Item<tokens[15], Deps[15]>
    & Item<tokens[16], Deps[16]>
    & Item<tokens[17], Deps[17]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
    & Item<tokens[13], Deps[13]>
    & Item<tokens[14], Deps[14]>
    & Item<tokens[15], Deps[15]>
    & Item<tokens[16], Deps[16]>
    & Item<tokens[17], Deps[17]>
    & Item<tokens[18], Deps[18]>
    :
    tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
    & Item<tokens[13], Deps[13]>
    & Item<tokens[14], Deps[14]>
    & Item<tokens[15], Deps[15]>
    & Item<tokens[16], Deps[16]>
    & Item<tokens[17], Deps[17]>
    & Item<tokens[18], Deps[18]>
    & Item<tokens[19], Deps[19]>
  :
  tokens extends [any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any] ?
    & Item<tokens[0], Deps[0]>
    & Item<tokens[1], Deps[1]>
    & Item<tokens[2], Deps[2]>
    & Item<tokens[3], Deps[3]>
    & Item<tokens[4], Deps[4]>
    & Item<tokens[5], Deps[5]>
    & Item<tokens[6], Deps[6]>
    & Item<tokens[7], Deps[7]>
    & Item<tokens[8], Deps[8]>
    & Item<tokens[9], Deps[9]>
    & Item<tokens[10], Deps[10]>
    & Item<tokens[11], Deps[11]>
    & Item<tokens[12], Deps[12]>
    & Item<tokens[13], Deps[13]>
    & Item<tokens[14], Deps[14]>
    & Item<tokens[15], Deps[15]>
    & Item<tokens[16], Deps[16]>
    & Item<tokens[17], Deps[17]>
    & Item<tokens[18], Deps[18]>
    & Item<tokens[19], Deps[19]>
    & Item<tokens[20], Deps[20]>
  :
  never
