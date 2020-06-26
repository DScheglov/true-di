import createInstance, { IConstructor } from './createInstance';

const instance = <T, ContainerInterface, D extends keyof ContainerInterface>(
  construtcor: IConstructor<T, Array<ContainerInterface[D]>>,
  inject: D[] = [],
) => (container: ContainerInterface): T => createInstance(construtcor, container, inject, []);

export default instance;
