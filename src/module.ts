/* eslint-disable no-use-before-define */
import diContainer from './di-container';
import { hasOwn } from './utils/has-own';
import { IInstanceInitializer } from './types';
import allNames from './utils/all-names';

interface IUnboundFactory<S extends {}, P extends {}, D> {
  (container: S, params: P): D;
}

type IInitializers<S extends {}, P extends {}> = Partial<{
  [token in keyof S]: IInstanceInitializer<S, P, token>
}>

type IModule<S extends {}, PS extends {}, P extends {}, Init extends boolean = true> = {
  public<Token extends Exclude<string | symbol, keyof (S & PS)>, PP extends {}, D>(
    item: { [token in Token]: IUnboundFactory<S & PS, PP, D> },
  ): IModule<S & { [t in Token]: D }, PS, P & PP, Init>;
  private<Token extends Exclude<string | symbol, keyof (S & PS)>, PP extends {}, D>(
    item: { [token in Token]: IUnboundFactory<S & PS, PP, D> },
  ): IModule<S, PS & { [t in Token]: D }, P & PP, Init>;
} & (
  [keyof P] extends [never]
    ? { create(): S }
    : { create(params: P): S; }
) &(
  Init extends true
    ? { init(initializers: IInitializers<S & PS, P>): IModule<S, PS, P, false> }
    : {}
);

const Module = <
  S extends {} = {},
  PS extends {} = {},
  P extends {} = {},
  Init extends boolean = true
>() => {
  const publicFactories = {} as S;
  const privateFactories = {} as PS;

  const theModule: IModule<S, PS, P> = {} as any;

  const publicResolver = <Token extends Exclude<string | symbol, keyof (S & PS)>, PP extends {}, D>(
    item: { [token in Token]: IUnboundFactory<S & PS, PP, D> },
  ): IModule<S & { [t in Token]: D }, PS, P & PP, Init> => {
    Object.defineProperties(publicFactories, Object.getOwnPropertyDescriptors(item));
    return theModule as any;
  };

  const privateResolver = <
    Token extends Exclude<string | symbol, keyof (S & PS)>,
    PP extends {},
    D
  >(
      item: { [token in Token]: IUnboundFactory<S & PS, PP, D> },
    ): IModule<S, PS & { [t in Token]: D }, P & PP, Init> => {
    Object.defineProperties(privateFactories, Object.getOwnPropertyDescriptors(item));
    return theModule as any;
  };

  const init = (initializers: IInitializers<S & PS, P>) => {
    allNames(initializers).forEach(name => {
      const [factories, currentValue] =
        hasOwn(publicFactories, name) ? [publicFactories, publicFactories[name]] :
        hasOwn(privateFactories, name) ? [privateFactories, privateFactories[name]] :
        [null, null];

      if (factories == null) throw new TypeError(`The item ${String(name)} couldn't be resolved`);

      Object.defineProperty(factories, name, {
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

    delete (theModule as any).init;
    return theModule;
  };

  const containerFactory = diContainer(privateFactories as any, publicFactories as any);

  (theModule as any).public = publicResolver;
  (theModule as any).private = privateResolver;
  (theModule as any).create = containerFactory;
  (theModule as any).init = init;

  return theModule;
};

export default Module;
