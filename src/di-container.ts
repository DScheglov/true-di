import createInstanceFactory from './create-instance';
import { IFactories, IPureFactories } from './types';
import allNames from './utils/all-names';
import assertExists from './utils/assert-exists';
import mapObject from './utils/map-object';
import narrowObject from './utils/narrow-object';
import { shallowMerge } from './utils/shallow-merge';

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

const diContainer: {
  <Public extends object>(factories: IFactories<Public>): Public;
  <Private extends object, Public extends object>(
    privateFactories: Pick<IFactories<Private & Public>, keyof Private>,
    publicFactories?: Pick<IFactories<Private & Public>, keyof Public>,
  ): Public
} = <Private extends object, Public extends object = Private>(
  privateFactories: Pick<IFactories<Private & Public>, keyof Private>,
  publicFactories?: Pick<IFactories<Private & Public>, keyof Public>,
): Public => {
  const instances = new Map();
  const factories: IFactories<Private & Public> =
    (publicFactories != null
      ? shallowMerge(privateFactories, publicFactories)
      : privateFactories) as any;

  const createInstance = createInstanceFactory(factories, instances);

  const container: Private & Public = allNames(factories).reduce<Private & Public>(
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

  return publicFactories != null ? narrowObject(container, allNames(publicFactories)) : container;
};

export default diContainer;
