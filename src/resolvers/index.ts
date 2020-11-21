import { Services } from '../types';
import { getFrom, isPromise } from './helpers';

export type Factory<D extends unknown[], T> = (...dependencies: D) => T;
export type Constructor<D extends unknown[], T> = {
  new(...dependencies: D): T
}

export type AsyncDeps<D extends unknown[]> = {
  [index in keyof D]: D[index] | Promise<D[index]>
}
export type Async<C extends {}> = {
  [p in keyof C]: C[p] | Promise<C[p]>
}

type Injector<C extends object, D extends any[]> = {
  (container: C): D
};

type WithInject<Inject> = {
  inject: Inject
}

type FromContainer<C extends {}, T> = {
  (container: C): T;
  (container: Async<C>): Promise<T>;
}

export const createInstance: {
  <D extends any[], T>(factory: Factory<D, T>, deps: D): T;
  <D extends any[], T>(factory: Factory<D, T>, deps: AsyncDeps<D>): Promise<T>;
} = <D extends any[], T>(factory: Factory<D, T>, deps: D): T | Promise<T> => (
  deps.some(isPromise)
    ? Promise.all(deps).then(resolvedDeps => factory(...(resolvedDeps as D)))
    : factory(...deps)
);

export const tokens = <token extends string|symbol, Items extends token[]>(
  ...names: Items
): Items => names;

export const asFactory: {
  <D extends any[], C extends object, T>(
    factory: Factory<D, T> & WithInject<Injector<C, D>>
  ): FromContainer<C, T>;
  <D extends any[], C extends object, T>(
    factory: Factory<D, T>,
    injector: Injector<C, D>,
  ): FromContainer<C, T>;
  <D extends any[], T, token extends string|symbol, tokens extends token[]>(
    factory: Factory<D, T> & WithInject<tokens>
  ): FromContainer<Services<tokens, D>, T>;
  <D extends any[], T, token extends string|symbol, tokens extends token[]>(
    factory: Factory<D, T>,
    tokens: tokens,
  ): FromContainer<Services<tokens, D>, T>;
  <C extends object, T>(
    factory: Factory<[C], T>
  ): Factory<[C], T>;
 } = (factory: any, inject = factory.inject) => (container: any) => (
   typeof inject === 'function' ? createInstance(factory, inject(container)) :
   Array.isArray(inject) ? createInstance(factory, inject.map(getFrom(container))) :
   factory(container)
 );

export const asClass: {
  <D extends any[], C extends object, T>(
    constructor: Constructor<D, T> & WithInject<Injector<C, D>>
  ): FromContainer<C, T>;
  <D extends any[], C extends object, T>(
    constructor: Constructor<D, T>,
    inject: Injector<C, D>,
  ): FromContainer<C, T>;
  <D extends any[], token extends string|symbol, T, tokens extends token[]>(
    constructor: Constructor<D, T> & WithInject<tokens>
  ): FromContainer<Services<tokens, D>, T>;
  <D extends any[], T, token extends string|symbol, tokens extends token[]>(
    constructor: Constructor<D, T>,
    inject: tokens,
  ): FromContainer<Services<tokens, D>, T>;
 } = (constructor: any, inject = constructor.inject) => asFactory(
   (...args) => Reflect.construct(constructor, args),
   inject,
 );
