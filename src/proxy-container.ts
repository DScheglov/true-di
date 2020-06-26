import getInstance, { IFactories, IInitializer } from './getInstance';
import UniqueStack from './unique-stack';
import containerRegistry, { IManager } from './container-manager';

const { registerContainer, createManager } = containerRegistry();

const diProxyContainer = <IContainer>(factories: IFactories<IContainer>): IContainer => {
  const instances = new Map();
  const stack = new UniqueStack<keyof IContainer>();
  const initializers = new Set<IInitializer<IContainer>>();

  const names = Object.keys(factories) as Array<keyof IContainer>;
  const symbols = Object.getOwnPropertySymbols(factories) as Array<keyof IContainer>;
  const allNames = names.concat(symbols);

  const nameSet = new Set<keyof IContainer>(allNames);

  let container: IContainer;

  const get = <T extends keyof IContainer>(_: any, name: T): IContainer[T] =>
    getInstance(
      container, factories, instances, stack, initializers, name,
    );

  const set = <T extends keyof IContainer>(_: any, name: T, value: null | undefined) => {
    if (value != null) return false;
    instances.delete(name);
    return true;
  };

  const ownKeys = () => names;

  const getOwnPropertyDescriptor = <T extends keyof IContainer>(_: any, name: T) => (
    nameSet.has(name)
      ? {
        enumerable: typeof name !== 'symbol',
        configurable: true,
        get: () => get(container, name),
      }
      : undefined
  );

  const deleteProperty = () => false;

  container = new Proxy(Object.create(null), {
    get,
    set,
    ownKeys,
    getOwnPropertyDescriptor,
    deleteProperty,
  });

  registerContainer(container, instances, allNames);

  return container;
};

export { createManager };

export { IFactories, IManager };

export default diProxyContainer;
