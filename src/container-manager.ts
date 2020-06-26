type ContainerRecord<IContainer> = {
  instances: Map<keyof IContainer, any>;
  names: Array<keyof IContainer>;
}

export interface IManager<IContainer> {
  isReady<T extends keyof IContainer>(name: T): boolean;
  prepareAll(): IContainer;
  releaseAll(): void;
}

const registerContainer = (containers: WeakMap<any, ContainerRecord<any>>) => <IContainer>(
  container: IContainer,
  instances: Map<keyof IContainer, any>,
  names: Array<keyof IContainer>,
): void => {
  containers.set(container, { instances, names });
};

const isReady = <IContainer>({ instances }: ContainerRecord<IContainer>) =>
  <T extends keyof IContainer>(name: T): boolean => instances.has(name);

const prepareAll = <IContainer>(container: IContainer, { names }: ContainerRecord<IContainer>) =>
  (): IContainer => names.reduce(
    (instances: IContainer, name: keyof IContainer) => {
      instances[name] = container[name]; // eslint-disable-line no-param-reassign
      return instances;
    },
    Object.create(null),
  );

const releaseAll = <IContainer>({ instances }: ContainerRecord<IContainer>) =>
  (): void => {
    instances.clear();
  };

const createManager = (containers: WeakMap<any, ContainerRecord<any>>) =>
  <IContainer>(container: IContainer): IManager<IContainer> => ({
    isReady: isReady(containers.get(container) as ContainerRecord<IContainer>),
    prepareAll: prepareAll(container, containers.get(container)),
    releaseAll: releaseAll(containers.get(container)),
  });

const containerRegistryApi = (containers: WeakMap<any, ContainerRecord<any>>) => ({
  registerContainer: registerContainer(containers),
  createManager: createManager(containers),
});

const containerRegistry = () => containerRegistryApi(new WeakMap());

export default containerRegistry;
