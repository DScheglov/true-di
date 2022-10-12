import createServiceLocatorFactory from './service-locator';
import { hasOwn } from './utils/has-own';
import { compose2 } from './utils/compose2';
import { memoize } from './utils/memoize';
import allNames from './utils/all-names';
import { shallowMerge } from './utils/shallow-merge';
import { AnyThunks, bindWithRun, BoundThunks } from './bind-with-run-in-context';

export type IResolver<S extends {}, P extends {}, D> = (container: S, params: P) => D;
export type IInitializer<S extends {}, P extends {}, N extends keyof S> = (
  instance: S[N],
  container: S,
  params: P,
  name: N,
) => void;

export type IResolutionTuple<T extends {}, S extends {}, P extends {}, N extends keyof T> = [
  IResolver<S, P, T[N]>,
  IInitializer<S & T, P, N>,
]

type IResolvers<T extends {}, S extends {}, P extends {}> = {
  [token in keyof T]: IResolver<S, P, T[token]> | IResolutionTuple<T, S, P, token>
}

type IInitializers<S extends {}, P extends {}> = Partial<{
  [token in keyof S]: IInitializer<S, P, token>
}>

type ObjectOmitFieldsOf<omit extends {}> = {
  [key in Exclude<string | symbol, keyof omit>]: any
}

export type ICreatable<S, P> =
  [keyof P] extends [never]
    ? { create(): S }
    : { create(params: P): S; }

export type IManagableCreate<S, P> = ICreatable<S, P> & {
  singleton(): ICreatable<S, P>;
} & (
  [keyof P] extends [never] ? {} : {
    memo(getKey: (params: P) => any): ICreatable<S, P>;
  }
)

export type IExposible<S extends {}, P extends {}> = {
  expose<T>(factory: IResolver<S, P, T>): IManagableCreate<T, P>;
  useCases<Thunks extends AnyThunks<S>>(
    thunks: Thunks
  ): IManagableCreate<BoundThunks<Thunks>, P>;
}

type IModuleBuilder<S extends {}, PS extends {}, P extends {}, Init extends boolean = true> = {
  public<Items extends ObjectOmitFieldsOf<S & PS>, PP extends {}>(
    items: IResolvers<Items, S & PS, PP>,
  ): IModuleBuilder<S & Items, PS, P & PP, Init>;
  private<Items extends ObjectOmitFieldsOf<S & PS>, PP extends {}>(
    items: IResolvers<Items, S & PS, PP>,
  ): IModuleBuilder<S, PS & Items, P & PP, Init>;

} & (
  IExposible<S & PS, P>
) & (
  IManagableCreate<S, P>
) & (
  Init extends true
    ? { init(initializers: IInitializers<S & PS, P>): IModuleBuilder<S, PS, P, false> }
    : {}
);

const Module = <
  S extends {} = {},
  PS extends {} = {},
  P extends {} = {},
  Init extends boolean = true
>() => {
  let selector: any = null;
  let memoizer: any = <T>(value: T) => value;
  const publicResolvers = {} as S;
  const privateResolvers = {} as PS;

  const builder: IModuleBuilder<S, PS, P> = {} as any;

  const addPublicResolvers = <Items extends ObjectOmitFieldsOf<S & PS>, PP extends {}>(
    resolvers: IResolvers<Items, S & PS, PP>,
  ): IModuleBuilder<S & Items, PS, P & PP, Init> => {
    Object.defineProperties(publicResolvers, Object.getOwnPropertyDescriptors(resolvers));
    return builder as any;
  };

  const addPrivateResolvers = <Items extends ObjectOmitFieldsOf<S & PS>, PP extends {}>(
    resolvers: IResolvers<Items, S & PS, PP>,
  ): IModuleBuilder<S, PS & Items, P & PP, Init> => {
    Object.defineProperties(privateResolvers, Object.getOwnPropertyDescriptors(resolvers));
    return builder as any;
  };

  const init = (initializers: IInitializers<S & PS, P>) => {
    allNames(initializers).forEach(name => {
      const [resolvers, currentValue] =
        hasOwn(publicResolvers, name) ? [publicResolvers, publicResolvers[name]] :
        hasOwn(privateResolvers, name) ? [privateResolvers, privateResolvers[name]] :
        [null, null];

      if (resolvers == null) throw new TypeError(`Token "${String(name)}" couldn't be resolved`);

      Object.defineProperty(resolvers, name, {
        value: Array.isArray(currentValue)
          ? [currentValue[0], <N extends keyof S>(
            instance: (S & PS)[N],
            container: S & PS,
            params: P,
            token: N,
          ) => {
            initializers[name]!(instance as any, container, params, token as any);
            currentValue[1](instance, container, params, token);
          }]
          : [currentValue, initializers[name]]
        ,
      });
    });

    delete (builder as any).init;
    return builder;
  };

  const createLocatorFactory = () =>
    (selector == null
      ? createServiceLocatorFactory(privateResolvers, publicResolvers)
      : compose2(selector, createServiceLocatorFactory(
        shallowMerge(publicResolvers, privateResolvers) as any,
      )));

  const create = () => memoizer(createLocatorFactory());

  const Create = Object.defineProperties(Object.create(null), {
    create: {
      get: create,
    },
    memo: {
      get: () => memo, // eslint-disable-line no-use-before-define
    },
    singleton: {
      get: () => singleton, // eslint-disable-line no-use-before-define
    },
  });

  const expose = <T>(factory: IResolver<S & PS, P, T>) => {
    selector = factory;
    return Create;
  };

  const memo = (getKey: (params: P) => any) => {
    memoizer = memoize(getKey);
    return { create: create() };
  };

  const useCases = <Thunks extends AnyThunks<S & PS>>(
    thunks: Thunks,
  ) => expose(bindWithRun(thunks));

  const singleton = () => memo(() => 0);

  Object.defineProperties(builder, Object.getOwnPropertyDescriptors(Create));

  (builder as any).public = addPublicResolvers;
  (builder as any).private = addPrivateResolvers;
  (builder as any).init = init;
  (builder as any).expose = expose;
  (builder as any).useCases = useCases;

  return builder;
};

export default Module;
