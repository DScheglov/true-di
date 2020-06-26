/* eslint-disable no-param-reassign */
import UniqueStack from './unique-stack';
import getInstance, { IFactories, IInitializer } from './getInstance';

describe('getInstance', () => {
  it('creates new instance if it is not created yet', () => {
    type Container = {
      vector: {
        x: number,
        y: number
      }
    }
    const instances = new Map();
    const stack = new UniqueStack<keyof Container>();
    const factories: IFactories<Container> = {
      vector: jest.fn(() => ({ x: 1, y: 2 })),
    };

    const container = Object.freeze({}) as Container;
    const initializers = new Set<IInitializer<Container>>();
    const newVector = getInstance(container, factories, instances, stack, initializers, 'vector');

    expect(newVector).toEqual({ x: 1, y: 2 });
    expect(instances.get('vector')).toBe(newVector);
    expect(factories.vector).toHaveBeenCalledWith(container);
  });

  it('returns an existing instance if it is already created', () => {
    type Container = {
      vector: {
        x: number,
        y: number
      }
    }
    const oldVector = { x: 1, y: 2 };
    const instances = new Map<keyof Container, Container['vector']>([
      ['vector', oldVector],
    ]);
    const stack = new UniqueStack<keyof Container>();
    const factories: IFactories<Container> = {
      vector: jest.fn(() => ({ x: 1, y: 2 })),
    };

    const container = Object.freeze({}) as Container;
    const initializers = new Set<IInitializer<Container>>();
    const newVector = getInstance(container, factories, instances, stack, initializers, 'vector');

    expect(newVector).toBe(oldVector);
    expect(instances.get('vector')).toBe(newVector);
    expect(factories.vector).not.toHaveBeenCalled();
  });

  it('throws an error in case of cyclic dependencies', () => {
    type Vector = { x: number, y: number };
    type Container = {
      vector: Vector,
    }
    const instances = new Map();
    const stack = new UniqueStack<keyof Container>();
    const factories: IFactories<Container> = {
      vector: () => ({ x: 1, y: 2 }),
    };
    const container = Object.freeze({}) as Container;
    const initializers = new Set<IInitializer<Container>>();

    stack.push('vector');

    expect(
      () => getInstance(container, factories, instances, stack, initializers, 'vector'),
    ).toThrow('Cyclic dependencies couldn\'t be resolved.');
  });

  it('throws an error in case of intercepted exception', () => {
    type Vector = { x: number, y: number };
    type Container = {
      vector: Vector,
    }
    const instances = new Map();
    const stack = new UniqueStack<keyof Container>();
    const factories: IFactories<Container> = {
      vector: () => {
        stack.push('vector2' as 'vector');
        return ({ x: 1, y: 2 });
      },
    };
    const container = Object.freeze({}) as Container;
    const initializers = new Set<IInitializer<Container>>();

    expect(
      () => getInstance(container, factories, instances, stack, initializers, 'vector'),
    ).toThrow('Not all dependencies resolved correctly.');
  });

  it('throws an Error in attempt to create instance for name without factory', () => {
    type Vector = { x: number, y: number };
    type Container = {
      vector: Vector,
    }
    const instances = new Map();
    const stack = new UniqueStack<keyof Container>();
    const factories: IFactories<Container> = {
      vector: () => ({ x: 1, y: 2 }),
    };
    const container = Object.freeze({}) as Container;
    const initializers = new Set<IInitializer<Container>>();

    expect(
      () => getInstance(container, factories, instances, stack, initializers, 'vector2' as 'vector'),
    ).toThrow('Factory is not defined for name "vector2"');
  });
});
