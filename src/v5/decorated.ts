import { descriptor } from '../utils/descriptor';
import { LifeCycle, Resolver } from './types';

export const decorated = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  decoratedResolver: Resolver<PrM, PbM, ExtD, T>,
  original: Resolver<PrM, PbM, ExtD, T>,
  decoratorName: string,
  lifeCycle: LifeCycle,
  force: boolean,
) => Object.defineProperties(decoratedResolver as Resolver<PrM, PbM, ExtD, T>, {
    lifeCycle: descriptor(lifeCycle),
    original: descriptor(original),
    name: descriptor(`${decoratorName}(${original.name})`, true),
    force: descriptor(force),
  });