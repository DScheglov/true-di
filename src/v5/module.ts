/* eslint-disable no-use-before-define */
import { mergeResolvers } from './merge';
import createContainerFactory from './container-factory';
import { descriptor } from '../utils/descriptor';
import allNames from '../utils/all-names';
import { compose2 } from '../utils/compose2';
import { shallowMerge } from '../utils/shallow-merge';
import { memoize } from '../utils/memoize';
import {
  ProtoModule, ExcludeKeys, ItemResolver, Creatable, ExpositionSelector, ModuleBuilder,
} from './module-types';
import { Initializers } from './types';
import { bindWithRun } from './bind-with-run-in-context';
import { AnyThunks } from './thunks-types';

const addPrivateResolvers =
  <PrM extends {}, PbM extends {}, ExtD extends {}>(proto: ProtoModule<PrM, PbM, ExtD>) =>
  <Token extends ExcludeKeys<PbM & PrM>, Params extends {}, T>(
      items: ItemResolver<PrM, PbM, Token, Params, T>,
    ) => builderApi({
      ...proto,
      privateResolvers: mergeResolvers(proto.privateResolvers, items as any) as any,
    } as ProtoModule<PrM & { [key in Token]: T }, PbM, Params & ExtD>);

const addPublicResolvers =
  <PrM extends {}, PbM extends {}, ExtD extends {}>(proto: ProtoModule<PrM, PbM, ExtD>) =>
  <Token extends ExcludeKeys<PbM & PrM>, Params extends {}, T>(
      items: ItemResolver<PrM, PbM, Token, Params, T>,
    ) => builderApi({
      ...proto,
      publicResolvers: mergeResolvers(proto.privateResolvers, items as any) as any,
    } as ProtoModule<PrM, PbM & { [key in Token]: T }, Params & ExtD>);

const creatable = <PrM extends {}, PbM extends {}, ExtD extends {}>(
  {
    privateResolvers, publicResolvers, initializers, selector, memoizer,
  }: ProtoModule<PrM, PbM, ExtD>,
) => {
  // Guards
  const publicNames = allNames(publicResolvers);
  if (selector == null && publicNames.length === 0) return null;
  const privateNames = allNames(privateResolvers);
  if (selector != null && publicNames.length === 0 && privateNames.length === 0) return null;

  const mergedConatiner = () => createContainerFactory<{}, PrM & PbM, ExtD>(
    {} as any,
    shallowMerge(privateResolvers, publicResolvers) as any,
    initializers as any,
  );
  const createContainer =
    selector != null
      ? compose2(selector, mergedConatiner())
      : createContainerFactory(privateResolvers, publicResolvers, initializers);

  return {
    create: descriptor(memoizer != null ? memoizer(createContainer) : createContainer, true),
  };
};

const memo =
  <PrM extends {}, PbM extends {}, ExtD extends {}, EmptyResult extends boolean>(
    proto: ProtoModule<PrM, PbM, ExtD>,
  ) =>
    (getMemoKey: (params: ExtD) => any): Creatable<PbM, ExtD, EmptyResult> => Object.create(
      null,
      creatable({ ...proto, memoizer: memoize(getMemoKey) as any }) ?? {},
    );

const singleton =
  <PrM extends {}, PbM extends {}, ExtD extends {}, EmptyResult extends boolean>(
    proto: ProtoModule<PrM, PbM, ExtD>,
  ) => {
    const addMemoizer = memo<PrM, PbM, ExtD, EmptyResult>(proto);
    return () => addMemoizer(() => 0);
  };

const managebleCreate =
  <PrM extends {}, PbM extends {}, ExtD extends {}, EmptyResult extends boolean>(
    proto: ProtoModule<PrM, PbM, ExtD>,
  ) => ({
    memo: descriptor(memo<PrM, PbM, ExtD, EmptyResult>(proto), true),
    singleton: descriptor(singleton<PrM, PbM, ExtD, EmptyResult>(proto), true),
    ...creatable(proto),
  });

const expose = <PrM extends {}, PbM extends {}, ExtD extends {}>(
  proto: ProtoModule<PrM, PbM, ExtD>,
) =>
  <T>(selector: ExpositionSelector<PrM & PbM, T>) => Object.create(
      null,
      managebleCreate({ ...proto, selector }),
    );

const useCases = <PrM extends {}, PbM extends {}, ExtD extends {}>(
  proto: ProtoModule<PrM, PbM, ExtD>,
) => {
  const doExpose = expose(proto);
  return <Thunks extends AnyThunks<PrM & PbM>>(thunks: Thunks) => doExpose(bindWithRun(thunks));
};

const exposible = <PrM extends {}, PbM extends {}, ExtD extends {}>(
  proto: ProtoModule<PrM, PbM, ExtD>,
) => ({
    expose: descriptor(expose(proto), true),
    useCases: descriptor(useCases(proto), true),
  });

const init = <PrM extends {}, PbM extends {}, ExtD extends {}>(
  proto: ProtoModule<PrM, PbM, ExtD>,
) =>
    (initializers: Initializers<PrM & PbM, ExtD>) => {
      const newProto = { ...proto, initializers };

      return Object.create(null, {
        ...managebleCreate(newProto),
        ...exposible(newProto),
      });
    };

export const builderApi = <PrM extends {}, PbM extends {}, ExtD extends {}>(
  proto: ProtoModule<PrM, PbM, ExtD>,
): ModuleBuilder<PrM, PbM, ExtD> =>
    Object.create(null, {
      private: descriptor(addPrivateResolvers(proto), true),
      public: descriptor(addPublicResolvers(proto), true),
      init: descriptor(init(proto), true),
      ...managebleCreate(proto),
      ...exposible(proto),
    });

const Module = () => builderApi({
  privateResolvers: {},
  publicResolvers: {},
  initializers: {},
  selector: null,
  memoizer: null,
});

export default Module;
