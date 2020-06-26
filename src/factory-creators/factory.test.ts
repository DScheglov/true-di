/* eslint-disable max-classes-per-file */
import factoryFactory from './factory';

describe('instance', () => {
  it('creates an instanceFactory', () => {
    class Class {}

    type Container = {
      x: number,
      y: number,
    }

    const c = { Class };

    jest.spyOn(c, 'Class' as never);

    const factoryCreator = factoryFactory<Class, Container, keyof Container, [number, number]>(c.Class, ['x', 'y']);

    const factory = factoryCreator({ x: 1, y: 2 });

    expect(factory).toBeInstanceOf(Function);

    const instance = factory(3, 4);

    expect(instance).toBeInstanceOf(c.Class);
    expect(c.Class).toHaveBeenCalledWith(1, 2, 3, 4);
  });

  it('creates an instanceFactory that doesn\'t require injections', () => {
    class Class {}

    type Container = {
      x: number,
      y: number,
    }

    const c = { Class };

    jest.spyOn(c, 'Class' as never);

    const factoryCreator = factoryFactory<Class, Container, keyof Container, []>(c.Class);

    const factory = factoryCreator({ x: 1, y: 2 });

    expect(factory).toBeInstanceOf(Function);

    const instance = factory();

    expect(instance).toBeInstanceOf(c.Class);
    expect(c.Class).toHaveBeenCalledWith();
  });
});
