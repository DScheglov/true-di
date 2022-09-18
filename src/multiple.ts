import { IFactory, IFactoryTuple, IFactories } from './types';
import allNames from './utils/all-names';

const cleaner = <C extends {}, P extends {}>(
  instance: any, container: C, params: P, name: keyof C,
) => {
  container[name] = null as any;
};

const decorateFactory = <C extends {}, P extends {}, N extends keyof C>(
  factory: IFactory<C, P, N>,
): IFactoryTuple<C, P, N> => [
    factory,
    cleaner,
  ];

const decorateTupple = <C extends {}, P extends {}, N extends keyof C>(
  [factory, initilizer]: IFactoryTuple<C, P, N>,
): IFactoryTuple<C, P, N> => [
    factory,
    (instance: C[N], container: C, params: P, name: N) => {
      initilizer(instance, container, params, name);
      cleaner(instance, container, params, name);
    },
  ];

const decorateItemBinding = <C extends {}, P extends {}, N extends keyof C>(
  itemBinding: IFactory<C, P, N> | IFactoryTuple<C, P, N>,
): IFactoryTuple<C, P, N> => (
    typeof itemBinding === 'function'
      ? decorateFactory(itemBinding)
      : decorateTupple(itemBinding)
  );

const decorateFactories = <C extends {}, P extends {} = {}>(
  factories: IFactories<C, P>,
): IFactories<C, P> =>
    allNames(factories).reduce(
      (newObject, name) => Object.defineProperty(newObject, name, {
        ...Object.getOwnPropertyDescriptor(factories, name),
        value: decorateItemBinding(factories[name]),
      }),
      Object.create(null),
    );

const multiple: {
  <C extends {}, P extends {}, N extends keyof C>(
    itemBinding: IFactory<C, P, N> | IFactoryTuple<C, P, N>): IFactoryTuple<C, P, N>
  <C extends {}, P extends {}>(factories: IFactories<C, P>): IFactories<C, P>
} = <C extends {}, P extends {}, N extends keyof C>(
  bindingOrFactories: IFactory<C, P, N> | IFactoryTuple<C, P, N> | IFactories<C, P>,
) => (
    !Array.isArray(bindingOrFactories) && typeof bindingOrFactories === 'object'
      ? decorateFactories(bindingOrFactories)
      : decorateItemBinding(bindingOrFactories)
  ) as any;

export default multiple;
