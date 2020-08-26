import UniqueStack from './unique-stack';
import createInstance from './create-instance';
import { IFactories, VoidFn } from './types';

describe('getInstance', () => {
  it('creates new instance if it is not created yet', () => {
    type Container = {
      vector: {
        x: number,
        y: number
      }
    }
    const instances = new Map();
    const factories: IFactories<Container> = {
      vector: jest.fn(() => ({ x: 1, y: 2 })),
    };

    const container = Object.freeze({}) as Container;
    const newVector = createInstance(factories, instances)(container, 'vector');

    expect(newVector).toEqual({ x: 1, y: 2 });
    expect(instances.get('vector')).toBe(newVector);
    expect(factories.vector).toHaveBeenCalledWith(container);
  });

  it('throws an error in case of cyclic dependencies', () => {
    type Vector = { x: number, y: number };
    type Container = {
      vector: Vector,
    }
    const instances = new Map();
    const stack = UniqueStack<keyof Container>();
    const factories: IFactories<Container> = {
      vector: () => ({ x: 1, y: 2 }),
    };
    const container = Object.freeze({}) as Container;
    const initializers: VoidFn[] = [];

    stack.push('vector');

    expect(
      () => createInstance(factories, instances, stack, initializers)(container, 'vector'),
    ).toThrow('Cyclic dependencies couldn\'t be resolved.');
  });

  it('throws an error in case of intercepted exception', () => {
    type Vector = { x: number, y: number };
    type Container = {
      vector: Vector,
    }
    const instances = new Map();
    const stack = UniqueStack<keyof Container>();
    const factories: IFactories<Container> = {
      vector: () => {
        stack.push('vector2' as 'vector');
        return ({ x: 1, y: 2 });
      },
    };
    const container = Object.freeze({}) as Container;

    expect(
      () => createInstance(factories, instances, stack)(container, 'vector'),
    ).toThrow('Not all dependencies resolved correctly.');
  });

  it('throws an Error in attempt to create instance for name without factory', () => {
    type Vector = { x: number, y: number };
    type Container = {
      vector: Vector,
    }
    const instances = new Map();
    const stack = UniqueStack<keyof Container>();
    const factories: IFactories<Container> = {
      vector: () => ({ x: 1, y: 2 }),
    };
    const container = Object.freeze({}) as Container;
    const initializers: VoidFn[] = [];

    expect(
      () => createInstance(factories, instances, stack, initializers)(container, 'vector2' as 'vector'),
    ).toThrow('Factory is not defined for name "vector2"');
  });
});
