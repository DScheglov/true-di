/* eslint-disable max-classes-per-file */
import createInstance from './createInstance';

describe('createInstance', () => {
  it('creates instance of Class without enjection', () => {
    class Class {}

    const instance = createInstance(Class, {}, [] as never[], []);

    expect(instance).toBeInstanceOf(Class);
    expect(instance).toEqual({});
  });

  it('creates instance of Class and injects values from containers', () => {
    class Class {}

    const c = { Class };

    jest.spyOn(c, 'Class' as never);

    createInstance(c.Class, { x: 1, y: 2 }, ['x', 'y'], []);

    expect(c.Class).toHaveBeenCalledWith(1, 2);
  });

  it('creates instance of Class and injects values from containers and explicitly specified', () => {
    class Class {}

    const c = { Class };

    jest.spyOn(c, 'Class' as never);

    createInstance(c.Class, { x: 1, y: 2 }, ['x', 'y'], [3, 4]);

    expect(c.Class).toHaveBeenCalledWith(1, 2, 3, 4);
  });
});
