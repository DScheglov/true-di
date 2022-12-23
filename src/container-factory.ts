import allNames from './utils/all-names';
import narrowObject from './utils/narrow-object';
import { shallowMerge } from './utils/shallow-merge';
import { createInstanceFactory } from './create-instance';
import { Initializers, Resolvers } from './types';

const createContainerFactory = <
  PrM extends {},
  PbM extends {},
  Ext extends {}
>(
    privateResolvers: Resolvers<PrM, PrM, PbM, Ext>,
    publicResolvers: Resolvers<PbM, PrM, PbM, Ext>,
    initializers?: Initializers<PrM & PbM, Ext>,
  ) => (externalDependencies: Ext): PbM => {
    const resolvers: Resolvers<PrM & PbM, PrM, PbM, Ext> =
      shallowMerge(privateResolvers, publicResolvers) as any;

    const createInstance = createInstanceFactory(resolvers, initializers ?? {});

    const moduleContainer: PbM & PrM = allNames(resolvers).reduce(
      (containerObj, name) =>
        Object.defineProperty(containerObj, name, {
          configurable: false,
          enumerable: Object.getOwnPropertyDescriptor(resolvers, name)!.enumerable,
          get: () => createInstance(moduleContainer, name, externalDependencies),
        }),
      Object.create(null) as PbM & PrM,
    );

    return narrowObject(moduleContainer, allNames(publicResolvers));
  };

export default createContainerFactory;
