import mapObject from '../utils/map-object';
import {
  Thunk, Run, AnyThunks, BoundThunks,
} from './thunks-types';

const bindWithRunFn =
  <A extends any[], R, C>(fn: (...args: A) => Thunk<C, R>, run: Run<C>) =>
    (...args: A) => run(fn(...args));

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
