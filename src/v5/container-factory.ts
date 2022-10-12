import allNames from '../utils/all-names';
import narrowObject from '../utils/narrow-object';
import { shallowMerge } from '../utils/shallow-merge';
import { createInstanceFactory } from './create-instance';
import { AnyModule, Resolvers } from './types';

const createContainerFactory = <
  PrM extends AnyModule,
  PbM extends AnyModule,
  Ext extends {} = {}
>(
    privateResolvers: Resolvers<PrM, PrM & PbM, Ext>,
    publicResolvers: Resolvers<PbM, PrM & PbM, Ext>,
  ) => (externalDependencies: Ext): PbM => {
    const resolvers =
      shallowMerge(privateResolvers, publicResolvers) as Resolvers<PrM & PbM, PrM & PbM, Ext>;

    const createInstance = createInstanceFactory(resolvers);

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
