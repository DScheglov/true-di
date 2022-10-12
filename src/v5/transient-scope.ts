import { Resolver, AnyModule } from './types';
import { withLifeCycle } from './withLifeCycle';

export const transient = <IntD extends AnyModule, ExtD extends AnyModule, T>(
  resolver: Resolver<IntD, ExtD, T>,
): Resolver<IntD, ExtD, T> => withLifeCycle(resolver, 'transient');
