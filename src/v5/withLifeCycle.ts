import { LifeCycle } from './types';

export const withLifeCycle = <A extends any[], T>(
  fn: (...args: A) => T,
  lifeCycle: LifeCycle,
) => Object.defineProperty(fn, 'lifeCycle', {
    value: lifeCycle,
    enumerable: false,
    writable: false,
    configurable: false,
  });
