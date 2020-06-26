import UniqueStack from './unique-stack';
import { isEitherLeft } from './either';

export type IInitializer<IContainer> = (container: IContainer) => void;

export type IFactory <IContainer, N extends keyof IContainer> =
  (container: IContainer) => IContainer[N]

export type IFactoryTuple<IContainer, N extends keyof IContainer> =
  [IFactory<IContainer, N>, IInitializer<IContainer>];

export type IFactories<IContainer> = {
  [name in keyof IContainer]: IFactory<IContainer, name> | IFactoryTuple<IContainer, name>
}

const runInitializers = <IContainer>(
  initializers: Set<IInitializer<IContainer>>,
  container: IContainer,
) => {
  initializers.forEach(initializer => initializer(container));
  initializers.clear();
};

const getInstance = <IContainer>(
  container: IContainer,
  factories: IFactories<IContainer>,
  instances: Map<keyof IContainer, any>,
  stack: UniqueStack<keyof IContainer>,
  initializers: Set<IInitializer<IContainer>>,
  name: keyof IContainer,
) => {
  if (instances.has(name)) return instances.get(name);

  if (isEitherLeft(stack.push(name))) {
    throw new Error('Cyclic dependencies couldn\'t be resolved.');
  }

  const itemFactory = factories[name];

  const [factory, initializer] = (
    Array.isArray(itemFactory) ? itemFactory : [itemFactory, null]
  );

  if (typeof factory !== 'function') {
    throw Error(`Factory is not defined for name "${name}"`);
  }

  if (typeof initializer === 'function') initializers.add(initializer);

  const instance = factory(container);
  instances.set(name, instance);

  if (isEitherLeft(stack.pop(name))) {
    throw new Error('Not all dependencies resolved correctly.');
  }

  if (stack.size === 0) runInitializers(initializers, container);

  return instance;
};

export default getInstance;
