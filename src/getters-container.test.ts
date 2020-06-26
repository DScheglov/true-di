/* eslint-disable no-param-reassign */
import diContainer, { createManager } from './getters-container';
import { IManager } from './container-manager';

describe('gettersContainer', () => {
  it('creates a container', () => {
    type Container = {
      x: number,
    };

    const container = diContainer<Container>({
      x: () => 42,
    });

    expect(container).toBeDefined();
    expect(typeof container).toBe('object');
    expect({ ...container }).toEqual({ x: 42 });
    expect(container.x).toBe(42);
  });

  it('allows to resolve dependency in chain', () => {
    type Container = {
      x: number,
      y: number,
      z: number,
    }

    const container = diContainer<Container>({
      x: () => 1,
      y: ({ x }) => x + 2,
      z: ({ x, y }) => x * y + 3,
    });

    expect(container.z).toBe(6);
  });

  it('throws an exception in case of cyclic dependency', () => {
    type Container = {
      x: number,
      y: number,
    }

    const container = diContainer<Container>({
      x: ({ y }) => y,
      y: ({ x }) => x + 2,
    });

    expect(
      () => container.x,
    ).toThrow('Cyclic dependencies couldn\'t be resolved.');
  });

  it('throws an exception in case when error during dependency creation is suppressed', () => {
    type Container = {
      x: number,
      y: () => number,
    }

    const container = diContainer<Container>({
      x: () => {
        throw new Error('Failed to create x');
      },
      y: c => {
        let x: number;
        try {
          x = c.x;
        } catch (err) {
          x = 5;
        }

        return () => x;
      },
    });

    expect(
      () => container.y,
    ).toThrow('Not all dependencies resolved correctly.');
  });

  it('throws an error in attempt to assign any it\'s value', () => {
    type Container = {
      x: number,
    };

    const container = diContainer<Container>({
      x: () => 42,
    });

    expect(
      () => {
        container.x = 50;
      },
    ).toThrow();
  });

  it('works with Symbols', () => {
    const itemSymbol = Symbol('item');
    type Container = {
      [itemSymbol]: number
    };

    const itemFactory = jest.fn(() => 42);

    const container = diContainer<Container>({
      [itemSymbol]: itemFactory,
    });

    expect(container[itemSymbol]).toBe(42);
    expect(itemFactory).toHaveBeenCalledTimes(1);
  });

  it('allows to create container from factories defined separetelly', () => {
    const factories = {
      x: () => 42,
      y: (c: { x: number, y: (z: number) => number }) =>
        (z: number) => (z > 0 ? c.y(-c.x - z) : z),
    };

    const container = diContainer(factories);

    expect(container.x).toBe(42);
    expect(container.y(2)).toBe(-44);
  });

  it('allows to create all entities in single moment', () => {
    type Container = {
      x: number,
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => 42,
      y: ({ x }) => x * 2,
      z: ({ x, y }) => x + y,
    });

    const { ...values } = container;
    const values2 = { ...container };

    expect(values).toEqual({ x: 42, y: 84, z: 126 });
    expect(values2).toEqual({ x: 42, y: 84, z: 126 });
  });

  it('don\'t allow to delete items in the container', () => {
    type Container = {
      x: number,
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => 42,
      y: ({ x }) => x * 2,
      z: ({ x, y }) => x + y,
    });

    expect(
      () => {
        delete container.x;
      },
    ).toThrow();
  });

  it('allows to unbind name from it\'s value', () => {
    type Container = {
      x: { value: number },
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => ({ value: 42 }),
      y: ({ x }) => x.value * 2,
      z: ({ x, y }) => x.value + y,
    });

    const prevValueX = container.x;
    container.x = null;

    expect(container.x).toEqual({ value: 42 });
    expect(container.x).not.toBe(prevValueX);
  });
  it('allows to get ownPropertyDescriptor', () => {
    type Container = {
      x: number,
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => 42,
      y: ({ x }) => x * 2,
      z: ({ x, y }) => x + y,
    });

    const descriptor = Object.getOwnPropertyDescriptor(container, 'x');
    expect(descriptor.enumerable).toBeTruthy();

    expect(descriptor.get()).toBe(42);
  });

  it('ownPropertyDescriptor returns undefined if field is not defined', () => {
    type Container = {
      x: number,
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => 42,
      y: ({ x }) => x * 2,
      z: ({ x, y }) => x + y,
    });

    const descriptor = Object.getOwnPropertyDescriptor(container, 'xx');
    expect(descriptor).toBeUndefined();
  });

  it('it doesn\'t declare symbols as keys', () => {
    const y = Symbol('y');
    type Container = {
      x: number,
      [y]: number,
    };

    const container = diContainer<Container>({
      x: () => 42,
      [y]: ({ x }) => x * 2,
    });

    expect(Object.keys(container)).toEqual(['x']);
  });

  it('it allows to get descriptor for Symbolic property', () => {
    const y = Symbol('y');
    type Container = {
      x: number,
      [y]: number,
    };

    const container = diContainer<Container>({
      x: () => 42,
      [y]: ({ x }) => x * 2,
    });

    const descriptor = Object.getOwnPropertyDescriptor(container, y);
    expect(descriptor.enumerable).toBeFalsy();

    expect(descriptor.get()).toBe(84);
  });

  it('calls initializer to resolve cyclic dependencies (both initialzier)', () => {
    type Node = {
      child: Node,
      parent: Node,
    }

    type Container = {
      parentItem: Node,
      childItem: Node,
    }

    const createNode = () => ({ child: null, parent: null });

    const initParent = jest.fn(
      ({ parentItem, childItem }) => {
        parentItem.child = childItem;
      },
    );

    const initChild = jest.fn(
      ({ parentItem, childItem }) => {
        childItem.parent = parentItem;
      },
    );

    const container = diContainer<Container>({
      parentItem: [createNode, initParent],
      childItem: [createNode, initChild],
    });

    const child = container.childItem;
    const parent = container.parentItem;

    expect(parent).toEqual({ parent: null, child });
    expect(child).toEqual({ parent, child: null });

    expect(initParent).toHaveBeenCalledTimes(1);
  });
});

describe('createManager', () => {
  it('creates a container manager', () => {
    type Container = {
      x: { value: number },
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => ({ value: 42 }),
      y: ({ x }) => x.value * 2,
      z: ({ x, y }) => x.value + y,
    });

    const { isReady, prepareAll } = createManager(container);

    expect(isReady).toBeInstanceOf(Function);
    expect(prepareAll).toBeInstanceOf(Function);
  });

  it('allows to identify is some component is ready with isReady method', () => {
    type Container = {
      x: { value: number },
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => ({ value: 42 }),
      y: ({ x }) => x.value * 2,
      z: ({ x, y }) => x.value + y,
    });

    const { isReady } = createManager(container);

    expect(isReady('x')).toBeFalsy();

    expect(container.x).toEqual({ value: 42 });

    expect(isReady('x')).toBeTruthy();
  });

  it('allows to identify is some component is not ready if it was unbound', () => {
    type Container = {
      x: { value: number },
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => ({ value: 42 }),
      y: ({ x }) => x.value * 2,
      z: ({ x, y }) => x.value + y,
    });

    const { isReady } = createManager(container);

    expect(container.x).toEqual({ value: 42 });

    expect(isReady('x')).toBeTruthy();

    container.x = null;

    expect(isReady('x')).toBeFalsy();
  });

  it('allows to create all items in the container', () => {
    type Container = {
      x: number,
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => 1,
      y: () => 2,
      z: () => 3,
    });

    const { isReady, prepareAll } = createManager(container);

    expect(isReady('x')).toBeFalsy();
    expect(isReady('y')).toBeFalsy();
    expect(isReady('z')).toBeFalsy();

    prepareAll();

    expect(isReady('x')).toBeTruthy();
    expect(isReady('y')).toBeTruthy();
    expect(isReady('z')).toBeTruthy();
  });

  it('allows to create manager as container item', () => {
    type Container = {
      $: IManager<Container>,
      x: number,
    };

    const container = diContainer<Container>({
      $: createManager,
      x: () => 42,
    });

    expect(container.$.isReady('$')).toBeTruthy();
  });

  it('allows to release all items in the container', () => {
    type Container = {
      x: number,
      y: number,
      z: number,
    };

    const container = diContainer<Container>({
      x: () => 1,
      y: () => 2,
      z: () => 3,
    });

    const { isReady, prepareAll, releaseAll } = createManager(container);

    prepareAll();

    expect(isReady('x')).toBeTruthy();
    expect(isReady('y')).toBeTruthy();
    expect(isReady('z')).toBeTruthy();

    releaseAll();

    expect(isReady('x')).toBeFalsy();
    expect(isReady('y')).toBeFalsy();
    expect(isReady('z')).toBeFalsy();
  });
});
