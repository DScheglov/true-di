/* eslint-disable no-use-before-define */
import allNames from './utils/all-names';
import { compose2 } from './utils/compose2';
import { descriptor } from './utils/descriptor';
import mapObject from './utils/map-object';
import { memoize } from './utils/memoize';
import { shallowMerge } from './utils/shallow-merge';
import { readers } from './bind-with-module';
import createContainerFactory from './container-factory';
import { mergeResolvers } from './merge-resolvers';
import { ModuleBuilder, ProtoModule } from './module-types';
import { Initializers, Resolvers } from './types';

const $proto = Symbol.for('true-di/module-proto');

const addPrivateResolvers = (proto: any) => (decoratorOrItems: any, items: any) => builderApi({
  ...proto,
  privateResolvers: mergeResolvers(
    proto.privateResolvers,
    typeof decoratorOrItems === 'function'
      ? mapObject(items, name => decoratorOrItems(items[name]))
      : decoratorOrItems,
  ),
});

const addPublicResolvers = (proto: any) => (decoratorOrItems: any, items: any) => builderApi({
  ...proto,
  publicResolvers: mergeResolvers(
    proto.publicResolvers,
    typeof decoratorOrItems === 'function'
      ? mapObject(items, name => decoratorOrItems(items[name]))
      : decoratorOrItems,
  ),
});

const creatable = ({
  privateResolvers, publicResolvers, initializers, selector, memoizer,
}: any) => {
  // Guards
  const publicNames = allNames(publicResolvers);
  if (selector == null && publicNames.length === 0) return null;
  const privateNames = allNames(privateResolvers);
  if (selector != null && publicNames.length === 0 && privateNames.length === 0) return null;

  const mergedContainer = () => createContainerFactory(
    {} as any,
    shallowMerge(privateResolvers, publicResolvers) as any,
    initializers as any,
  );
  const createContainer =
    selector != null
      ? compose2(selector, mergedContainer())
      : createContainerFactory(privateResolvers, publicResolvers, initializers);

  return {
    create: descriptor(memoizer != null ? memoizer(createContainer) : createContainer, true),
  };
};

const memo = (proto: any) => (getMemoKey: any) => Object.create(
  Object.create({ [$proto]: proto }),
  creatable({ ...proto, memoizer: memoize(getMemoKey) as any }) ?? {},
);

const singleton = (proto: any) => {
  const addMemoizer = memo(proto);
  return () => addMemoizer(() => 0);
};

const manageableCreate = (proto: any) => ({
  memo: descriptor(memo(proto), true),
  singleton: descriptor(singleton(proto), true),
  ...creatable(proto),
});

const expose = (proto: any) => (selector: any) => Object.create(
  Object.create({ [$proto]: proto }),
  manageableCreate({ ...proto, selector }),
);

const useCases = (proto: any) => {
  const doExpose = expose(proto);
  return (thunks: any) => doExpose(readers(thunks));
};

const exposible = (proto: any) => ({
  expose: descriptor(expose(proto), true),
  useCases: descriptor(useCases(proto), true),
});

const init = (proto: any) => (initializers: any) => {
  const newProto = {
    ...proto,
    initializers: shallowMerge(proto.initializers, initializers),
  };

  return Object.create(Object.create({ [$proto]: newProto }), {
    ...manageableCreate(newProto),
    ...exposible(newProto),
  });
};

export const builderApi = <PrM extends {}, PbM extends {}, ExtD extends {}>(
  proto: ProtoModule<PrM, PbM, ExtD>,
): ModuleBuilder<PrM, PbM, ExtD> =>
    Object.create(Object.create({ [$proto]: proto }), {
      private: descriptor(addPrivateResolvers(proto), true),
      public: descriptor(addPublicResolvers(proto), true),
      init: descriptor(init(proto), true),
      ...manageableCreate(proto),
      ...exposible(proto),
    });

const Module = <PrM extends {} = {}, PbM extends {} = {}, ExtD extends {} = {}>(
  privateResolvers: Resolvers<PrM, PrM, PbM, ExtD> = {} as any,
  publicResolvers: Resolvers<PbM, PrM, PbM, ExtD> = {} as any,
  initializers: Initializers<PrM & PbM, ExtD> = {},
) => builderApi({
    privateResolvers,
    publicResolvers,
    initializers,
    selector: null,
    memoizer: null,
  });

const from = (module: any) => builderApi({
  privateResolvers: shallowMerge(module[$proto].privateResolvers),
  publicResolvers: shallowMerge(module[$proto].publicResolvers),
  initializers: shallowMerge(module[$proto].initializers),
  selector: null,
  memoizer: null,
});

Module.from = from;

export default Module;
