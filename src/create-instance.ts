import UniqueStack from './unique-stack';
import { decorateResolver } from './decorate-resolver';
import { shouldOverrideLifeCycle, overrideLifeCycle } from './life-cycle';
import { Initializers, LifeCycle, Resolvers } from './types';
import { hasOwn } from './utils/has-own';

export const createInstanceFactory = <PrM extends {}, PbM extends {}, ExtD extends {}>(
  resolvers: Resolvers<PrM & PbM, PrM, PbM, ExtD>,
  initializers: Initializers<PrM & PbM, ExtD>,
) => {
  type M = PrM & PbM;
  const stack = UniqueStack<keyof M>();
  const initialized = new WeakSet<any>();
  let init: Array<() => void> = [];
  let lifeCycles: Partial<{ [key in keyof M]: LifeCycle }> = {};

  return <Token extends keyof M>(container: M, name: Token, external: ExtD): M[Token] => {
    // console.log({ name, init: init.length, stack: stack.size });
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

    if (!hasOwn(resolver, 'lifeCycle')) {
      resolvers[name] = decorateResolver(
        resolver as any,
        lifeCycles[name] as any,
        [container, instance],
      );
    } else if (!resolver.force && lifeCycles[name] != null) {
      resolvers[name] = decorateResolver(
        resolver.original! as any,
        lifeCycles[name] as any,
        [container, instance],
      );
    }

    const dependentName = stack.prev();

    const updatedResolver = resolvers[name];

    if (dependentName != null && shouldOverrideLifeCycle(updatedResolver.lifeCycle!)) {
      lifeCycles[dependentName] = overrideLifeCycle(
        updatedResolver.lifeCycle!,
        lifeCycles[dependentName] as any,
      );
    }

    const initializer = (initializers as any)[name];

    if (typeof initializer === 'function' && !initialized.has(instance)) {
      initialized.add(instance);
      init.push(() => initializer(instance, container, external, name));
    }

    if (stack.pop(name)[0] != null) {
      throw new Error('Not all dependencies resolved correctly.');
    }

    if (stack.size === 0) {
      lifeCycles = {};
      const toRun = init.slice();
      init = [];
      toRun.forEach(initInstance => initInstance());
    }

    return instance;
  };
};
