// eslint-disable-next-line no-use-before-define
export type Thunk<C, R> = (context: C, run: Run<C>) => R;

export type Run<C> = <R>(thunk: Thunk<C, R>) => R;

export type DepsOf<T extends (...args: any) => any> =
  ReturnType<T> extends Thunk<infer C, any> ? C : never;

export type AnyThunks<C> = {
  [field in string | symbol]: (...args: any[]) => Thunk<C, any>;
};

export type BoundThunks<Th extends AnyThunks<any>> = {
  [field in keyof Th]: (...args: Parameters<Th[field]>) => ReturnType<ReturnType<Th[field]>>;
};
