import createInstance, { IConstructor } from './createInstance';

const factory = <T, ContainerInterface, D extends keyof ContainerInterface, A extends any[]>(
  construtcor: IConstructor<T, Array<ContainerInterface[D]>>,
  inject: D[] = [],
) => (container: ContainerInterface) =>
    (...args: A): T => createInstance(construtcor, container, inject, args);

export default factory;
