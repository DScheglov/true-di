/* eslint-disable max-classes-per-file */
import instanceFactory from './instance';

describe('instance', () => {
  it('creates an instanceFactory', () => {
    class Class {}

    type Container = {
      x: number,
      y: number,
    }

    const c = { Class };

    jest.spyOn(c, 'Class' as never);

    const factory = instanceFactory<Class, Container, keyof Container>(c.Class, ['x', 'y']);

    const instance = factory({ x: 1, y: 2 });
    expect(instance).toBeInstanceOf(c.Class);
    expect(c.Class).toHaveBeenCalledWith(1, 2);
  });

  it('creates an instanceFactory that doesn\'t require injections', () => {
    class Class {}

    type Container = {
      x: number,
      y: number,
    }

    const c = { Class };

    jest.spyOn(c, 'Class' as never);

    const factory = instanceFactory<Class, Container, keyof Container>(c.Class);

    const instance = factory({ x: 1, y: 2 });
    expect(instance).toBeInstanceOf(c.Class);
    expect(c.Class).toHaveBeenCalledWith();
  });
});
