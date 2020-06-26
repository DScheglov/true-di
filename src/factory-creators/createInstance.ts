export interface IConstructor<T, D extends any[]> {
  new(...args: D): T
}

const createInstance = <T, ContainerInterface, D extends keyof ContainerInterface, A extends any[]>(
  construtcor: IConstructor<T, Array<ContainerInterface[D]>>,
  container: ContainerInterface,
  inject: D[],
  args: A,
) => {
  const theInstance = Object.create(construtcor.prototype);

  construtcor.apply(
    theInstance,
    inject.map(dependency => container[dependency]).concat(args),
  );

  return theInstance;
};

export default createInstance;
