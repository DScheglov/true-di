import { asyncScope } from './async-scope';
import {
  ASYNC, LC_ASYNC, LC_TRANSIENT, TRANSIENT,
} from './life-cycle';
import { moduleScope } from './module-scope';
import { transient } from './transient-scope';
import type { Resolver } from './types';

export const decorateResolver = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  resolver: Resolver<PrM, PbM, ExtD, T>,
  lifeCycle: LC_TRANSIENT | LC_ASYNC | undefined,
  initial: [PrM & PbM, T],
): Resolver<PrM, PbM, ExtD, T> => (
    lifeCycle === TRANSIENT ? transient(resolver, false) :
    lifeCycle === ASYNC ? asyncScope(resolver, initial, false) :
    moduleScope(resolver, initial, false)
  );
