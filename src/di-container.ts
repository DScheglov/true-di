import createInstanceFactory from './create-instance';
import { IFactories, IPureFactories } from './types';
import allNames from './utils/all-names';
import assertExists from './utils/assert-exists';
import mapObject from './utils/map-object';

const $INSTANCES = Symbol('TRUE-DI::INSTANCES');

const itemsOf = <C extends object>(container: C): Map<keyof C, any> =>
  assertExists(
    (container as any)[$INSTANCES],
    'Argument is not a container',
  );

export const isReady = <C extends object>(container: C, name: keyof C): boolean =>
  itemsOf(container).has(name);

export const prepareAll = <C extends object>(container: C): C =>
  mapObject(container, name => container[name]);

export const releaseAll = <C extends object>(container: C): void => {
  itemsOf(container).clear();
};

export const factoriesFrom = <C extends object, N extends keyof C = keyof C>(
  container: C,
  names?: N[],
): IPureFactories<Pick<C, N>> =>
    mapObject<C, N, IPureFactories<Pick<C, N>>>(container, name => () => container[name], names);

function diContainer<C extends object>(factories: IFactories<C>): C {
  const instances = new Map();
  const createInstance = createInstanceFactory(factories, instances);

  const container: C = allNames(factories).reduce<C>(
    (containerObj, name) =>
      Object.defineProperty(containerObj, name, {
        configurable: false,
        enumerable: Object.getOwnPropertyDescriptor(factories, name)!.enumerable,
        get: () => createInstance(container, name),
        set: (value: null | undefined) => {
          if (value != null) {
            throw new Error('Container does\'t allow to replace items');
          }
          instances.delete(name);
        },
      }),
    Object.create(
      Object.create(null, {
        [$INSTANCES]: {
          configurable: false, writable: false, enumerable: false, value: instances,
        },
      }),
    ),
  );

  return container;
}

export default diContainer;
