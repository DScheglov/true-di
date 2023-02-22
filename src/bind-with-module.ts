import mapObject from './utils/map-object';
import {
  Reader, Run, AnyReaders, BoundReaders,
} from './reader-types';

const bindWithRun =
  <A extends any[], R, C>(fn: (...args: A) => Reader<C, R>, run: Run<C>) =>
    Object.defineProperty(
      (...args: A) => run(fn(...args)),
      'length',
      { value: fn.length },
    );

export const runWith = <M>(mod: M): Run<M> => {
  const run = <R>(reader: Reader<M, R>): R => reader(mod, run);
  return run;
};

export const reader = <M, Args extends any[], T>(readerFn: (...args: Args) => Reader<M, T>) =>
  (mod: M): (...args: Args) => T => bindWithRun(readerFn, runWith(mod));

export const readers = <M, Rs extends AnyReaders<M>>(readersMap: Rs) =>
  (mod: M): BoundReaders<Rs> =>
    mapObject<Rs, keyof Rs, BoundReaders<Rs>>(
      readersMap,
      name => bindWithRun(readersMap[name], runWith(mod)),
    );
