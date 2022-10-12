import createInstanceFactory from './create-instance';
import { ContainerFactory, IFactories, IPureFactories } from './types';
import allNames from './utils/all-names';
import assertExists from './utils/assert-exists';
import mapObject from './utils/map-object';
import narrowObject from './utils/narrow-object';
import { shallowMerge } from './utils/shallow-merge';

const $INSTANCES = Symbol('TRUE-DI::INSTANCES');

const itemsOf = <C extends {}>(container: C): Map<keyof C, any> =>
  assertExists(
    (container as any)[$INSTANCES],
    'Argument is not a container',
  );

export const isReady = <C extends {}>(container: C, name: keyof C): boolean =>
  itemsOf(container).has(name);

export const prepareAll = <C extends {}>(container: C): C =>
  mapObject(container, name => container[name]);

export const releaseAll = <C extends {}>(container: C): void => {
  itemsOf(container).clear();
};

export const factoriesFrom = <C extends {}, N extends keyof C = keyof C>(
  container: C,
  names?: N[],
): IPureFactories<Pick<C, N>> =>
    mapObject<C, N, IPureFactories<Pick<C, N>>>(container, name => () => container[name], names);

const createServiceLocatorFactory: {
  <S extends {}, P extends {} = {}>(factories: IFactories<S, P>): ContainerFactory<S, P>;
  <PS extends {}, S extends {}, P extends {} = {}>(
    privateFactories: Pick<IFactories<PS & S, P>, keyof PS>,
    publicFactories?: Pick<IFactories<PS & S, P>, keyof S>,
  ): ContainerFactory<S, P>
} = <PS extends {}, S extends {} = PS, P extends {} = {}>(
  privateFactories: Pick<IFactories<PS & S, P>, keyof PS>,
  publicFactories?: Pick<IFactories<PS & S, P>, keyof S>,
) => (resolutionParams: P = {} as P): S => {
    const instances = new Map();
    const factories: IFactories<PS & S, P> =
    (publicFactories != null
      ? shallowMerge(privateFactories, publicFactories)
      : privateFactories) as any;

    const createInstance = createInstanceFactory(factories, instances);

    const totalResolver: PS & S = allNames(factories).reduce<PS & S>(
      (containerObj, name) =>
        Object.defineProperty(containerObj, name, {
          configurable: false,
          enumerable: Object.getOwnPropertyDescriptor(factories, name)!.enumerable,
          get: () => createInstance(totalResolver, name, resolutionParams),
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

    return (
      publicFactories != null
        ? narrowObject(totalResolver, allNames(publicFactories))
        : totalResolver
    );
  };

export default createServiceLocatorFactory;
