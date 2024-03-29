import UniqueStack from './unique-stack';
import { IFactories, VoidFn } from './types';

const call = (fn: VoidFn) => fn();

const createInstanceFactory = <C extends object>(
  factories: IFactories<C>,
  instances: Map<keyof C, any>,
  stack = UniqueStack<keyof C>(),
  initializers: VoidFn[] = [],
) => <N extends keyof C>(container: C, name: N): C[N] => {
  if (instances.has(name)) return instances.get(name);

  if (stack.push(name)[0] != null) {
    throw new Error(
      'Cyclic dependencies couldn\'t be resolved.\n\n' +
      `Requested: ${String(name)}\nResolution stack:\n\t${stack.items.join('\n\t')}`,
    );
  }

  const itemFactory = factories[name];

  const [factory, initializer] = (
    Array.isArray(itemFactory) ? itemFactory : [itemFactory, null]
  );

  if (typeof factory !== 'function') {
    throw new Error(`Factory is not defined for name "${String(name)}"`);
  }

  const instance = factory(container);
  instances.set(name, instance);

  if (typeof initializer === 'function') {
    initializers.push(() => initializer(instance, container, name));
  }

  if (stack.pop(name)[0] != null) {
    throw new Error('Not all dependencies resolved correctly.');
  }

  if (stack.size === 0) {
    initializers.forEach(call);
    initializers = [];
  }

  return instance;
};

export default createInstanceFactory;
