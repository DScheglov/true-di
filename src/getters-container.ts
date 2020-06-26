import getInstance, { IFactories, IInitializer } from './getInstance';
import UniqueStack from './unique-stack';
import containerRegistry, { IManager } from './container-manager';

const { registerContainer, createManager } = containerRegistry();

const diGettersContainer = <IContainer>(factories: IFactories<IContainer>): IContainer => {
  const instances = new Map();
  const stack = new UniqueStack<keyof IContainer>();
  const initializers = new Set<IInitializer<IContainer>>();
  const names = (
    (Object.keys(factories) as Array<string | symbol>).concat(
      Object.getOwnPropertySymbols(factories),
    )
  ) as Array<keyof IContainer>;

  const container = names.reduce(
    <T extends keyof IContainer>(containerObj: IContainer, name: T) =>
      Object.defineProperty(containerObj, name, {
        configurable: false,
        enumerable: typeof name !== 'symbol',
        get: (): IContainer[T] =>
          getInstance(container, factories, instances, stack, initializers, name),
        set: (value: null | undefined) => {
          if (value != null) {
            throw new Error('Container does\'t allow to replace items');
          }
          instances.delete(name);
        },
      }),
    Object.create(null) as IContainer,
  );

  registerContainer(container, instances, names);

  return container;
};

export { createManager };

export { IFactories, IManager };

export default diGettersContainer;
