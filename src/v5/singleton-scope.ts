import { Resolver, AnyModule } from './types';
import { withLifeCycle } from './withLifeCycle';

export const singleton = <IntD extends AnyModule, ExtD extends AnyModule, T>(
  resolver: Resolver<IntD, ExtD, T>,
): Resolver<IntD, ExtD, T> => {
  let result: { instance: T } | null = null;
  return withLifeCycle((internal: IntD, extenal: ExtD) => {
    if (result) return result.instance;

    const instance = resolver(internal, extenal);

    result = { instance };

    return instance;
  }, 'singleton');
};
