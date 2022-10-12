import UniqueStack from '../unique-stack';
import { decorateWithLifeCycle } from './decorateWithLifeCycle';
import { overrideLifeCycle } from './overrideLifeCycle';
import { AnyModule, LifeCycle, Resolvers } from './types';

export const createInstanceFactory = <M extends AnyModule, ExtD extends AnyModule>(
  resolvers: Resolvers<M, M, ExtD>,
) => {
  const stack = UniqueStack<keyof M>();
  let lifeCycles: Partial<{ [key in keyof M]: LifeCycle }> = {};

  return <Token extends keyof M>(container: M, name: Token, external: ExtD): M[Token] => {
    if (stack.push(name)[0] != null) {
      throw new Error(
        'Cyclic dependencies couldn\'t be resolved.\n\n' +
        `Requested: ${String(name)}\nResolution stack:\n\t${stack.items.join('\n\t')}`,
      );
    }

    const resolver = resolvers[name];

    if (typeof resolver !== 'function') {
      throw new Error(`Resolver for "${String(name)}" is not difined.`);
    }

    const instance = resolver(container, external);

    if (resolver.lifeCycle != null) {
      stack.forEach(
        token => {
          lifeCycles[token] = overrideLifeCycle(resolver.lifeCycle!, lifeCycles[token]);
        },
      );
    } else {
      resolvers[name] = decorateWithLifeCycle(
        resolvers[name],
        lifeCycles[name],
        [container, instance],
      );
    }

    if (stack.pop(name)[0] != null) {
      throw new Error('Not all dependencies resolved correctly.');
    }

    if (stack.size === 0) {
      lifeCycles = {};
    }

    return instance;
  };
};
