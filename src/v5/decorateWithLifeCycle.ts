import { asyncScope } from './async-scope';
import { moduleScope } from './module-scope';
import { singleton } from './singleton-scope';
import { transient } from './transient-scope';
import { AnyModule, LifeCycle, Resolver } from './types';

export const decorateWithLifeCycle = <M extends AnyModule, ExtD extends AnyModule, T>(
  resolver: Resolver<M, ExtD, T>,
  lifeCycle: LifeCycle | undefined,
  initial: [M, T],
): Resolver<M, ExtD, T> => {
  const decorator = (
    lifeCycle === 'transient' ? transient :
    lifeCycle === 'async' ? asyncScope :
    lifeCycle === 'singleton' ? singleton :
    moduleScope
  );

  return decorator(resolver, initial);
};
