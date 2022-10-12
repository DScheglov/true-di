import mapObject from './utils/map-object';

// eslint-disable-next-line no-use-before-define
export type Thunk<C, R> = (context: C, run: Run<C>) => R;

export type Run<C> = <R>(thunk: Thunk<C, R>) => R;

const bindWithRunFn =
  <A extends any[], R, C>(fn: (...args: A) => Thunk<C, R>, run: Run<C>) =>
    (...args: A) => run(fn(...args));

export type DepsOf<T extends (...args: any) => any> =
  ReturnType<T> extends Thunk<infer C, any> ? C : never;

export type AnyThunks<C> = {
  [field in string | symbol]: (...args: any[]) => Thunk<C, any>;
}

export type BoundThunks<Th extends AnyThunks<any>> = {
  [field in keyof Th]: (...args: Parameters<Th[field]>) => ReturnType<ReturnType<Th[field]>>
}

export const runWith = <C>(context: C): Run<C> => {
  const run = <R>(thunk: Thunk<C, R>) => thunk(context, run);
  return run;
};

export const bindWithRun = <C, Thunks extends AnyThunks<C>>(thunks: Thunks) =>
  (context: C): BoundThunks<Thunks> =>
    mapObject<Thunks, keyof Thunks, BoundThunks<Thunks>>(
      thunks,
      name => bindWithRunFn(thunks[name], runWith(context)),
    );
