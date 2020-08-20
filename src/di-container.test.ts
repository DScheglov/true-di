import diContainer, {
  factoriesFrom, isReady, prepareAll, releaseAll,
} from './di-container';
import { expectStrictType } from './utils/type-test-utils';
import { assignProps } from './utils/assign-props';
import allNames from './utils/all-names';
import { IFactories } from './types';

describe('diContainer', () => {
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
    expect(descriptor.enumerable).toBeTruthy();

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

    const createNode = (): Node => ({ child: null, parent: null });

    const container = diContainer<Container>({
      parentItem: [createNode, (self, { childItem }) => {
        self.child = childItem;
      }],
      childItem: [createNode, (self, { parentItem }) => {
        self.parent = parentItem;
      }],
    });

    const child = container.childItem;
    const parent = container.parentItem;

    expect(parent).toEqual({ parent: null, child });
    expect(child).toEqual({ parent, child: null });
  });

  it('calls initializer to resolve cyclic dependencies (both initialzier) with assignProps', () => {
    type Node = {
      name: string,
      child: Node,
      parent: Node,
    }

    type Container = {
      childName: string,
      parentName: string,
      parentItem: Node,
      childItem: Node,
    }

    const createNode = (): Node => ({ name: '', child: null, parent: null });

    const container = diContainer<Container>({
      childName: () => 'The Child',
      parentName: () => 'The Parent',
      parentItem: [createNode, assignProps({ child: 'childItem', name: 'parentName' })],
      childItem: [createNode, assignProps({ parent: 'parentItem', name: 'childName' })],
    });

    const child = container.childItem;
    const parent = container.parentItem;

    expect(parent).toEqual({ parent: null, child, name: 'The Parent' });
    expect(child).toEqual({ parent, child: null, name: 'The Child' });
  });

  it('allows to nest containers', () => {
    type Nested = {
      x: number,
      y: number,
      z: number,
    };

    type Parent = {
      alpha: string,
      betta: Nested,
    };

    const container = diContainer<Parent>({
      alpha: () => 'alpha',
      betta: parent => diContainer<Nested>({
        x: () => 1,
        y: () => 2,
        z: ({ x, y }) => (x + y) * parent.alpha.length,
      }),
    });

    expect(container.betta.z).toBe(15);
  });

  it('allows to declare partial factories', () => {
    type IContainer = {
      x: number,
      y: string,
      z: boolean,
    };

    const xFactory: Pick<IFactories<IContainer>, 'x'> = {
      x: () => 1,
    };

    const yFactory: Pick<IFactories<IContainer>, 'y'> = {
      y: () => 'Y',
    };

    const zFactory: Pick<IFactories<IContainer>, 'z'> = {
      z: ({ x, y }) => y.length === x,
    };

    const container = diContainer<IContainer>({
      ...xFactory,
      ...yFactory,
      ...zFactory,
    });

    expect(container.z).toBe(true);
  });

  it('allows to declare pure factories', () => {
    const x = () => 1;

    const y = () => 'Y';

    // eslint-disable-next-line no-shadow
    const z = ({ x, y }: { x: number, y: string }) => y.length === x;

    // eslint-disable-next-line no-shadow
    const t = ({ z }: { z: boolean }) => !z;

    const container = diContainer({
      x, y, z, t,
    });

    expectStrictType<{ x: number, y: string, z: boolean, t: boolean }>(container);

    expect(container.z).toBe(true);
  });
});

describe('isReady', () => {
  it('allows to identify if some component is ready', () => {
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

    expect(isReady(container, 'x')).toBeFalsy();

    expect(container.x).toEqual({ value: 42 });

    expect(isReady(container, 'x')).toBeTruthy();
  });

  it('allows to identify if some component is not ready', () => {
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

    expect(container.x).toEqual({ value: 42 });

    expect(isReady(container, 'x')).toBeTruthy();

    container.x = null;

    expect(isReady(container, 'x')).toBeFalsy();
  });
});

describe('prepareAll', () => {
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

    expect(isReady(container, 'x')).toBeFalsy();
    expect(isReady(container, 'y')).toBeFalsy();
    expect(isReady(container, 'z')).toBeFalsy();

    prepareAll(container);

    expect(isReady(container, 'x')).toBeTruthy();
    expect(isReady(container, 'y')).toBeTruthy();
    expect(isReady(container, 'z')).toBeTruthy();
  });

  it('creates the same as spread operator if container doesn\'t have non-enumerable props', () => {
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

    expect(
      prepareAll(container),
    ).toEqual({ ...container });
  });

  it('creates items also for non-enumerable props', () => {
    type Container = {
      x: number,
      y: number,
      z: number,
    };

    const container = diContainer<Container>(Object.create(null, {
      x: { value: () => 1, enumerable: true },
      y: { value: () => 2, enumerable: true },
      z: { value: () => 3, enumerable: false },
    }));

    prepareAll(container);

    expect(isReady(container, 'x')).toBeTruthy();
    expect(isReady(container, 'y')).toBeTruthy();
    expect(isReady(container, 'z')).toBeTruthy();
  });
});

describe('releaseAll', () => {
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

    prepareAll(container);

    expect(isReady(container, 'x')).toBeTruthy();
    expect(isReady(container, 'y')).toBeTruthy();
    expect(isReady(container, 'z')).toBeTruthy();

    releaseAll(container);

    expect(isReady(container, 'x')).toBeFalsy();
    expect(isReady(container, 'y')).toBeFalsy();
    expect(isReady(container, 'z')).toBeFalsy();
  });
});

describe('factoriesFrom', () => {
  it('creates a factories object from container', () => {
    type IContainer = {
      x: number,
      y: string,
    };

    const container = diContainer<IContainer>({
      x: () => 42,
      y: ({ x }) => `the x is ${x}`,
    });

    const factories = factoriesFrom(container);

    expect(allNames(factories)).toEqual(['x', 'y']);
    expect(factories.x).toBeInstanceOf(Function);
    expect(factories.y).toBeInstanceOf(Function);

    expect(factories.x()).toBe(container.x);
    expect(factories.y()).toBe(container.y);
  });

  it('doesn\'t affect container items', () => {
    type IContainer = {
      x: number,
      y: string,
    };

    const container = diContainer<IContainer>({
      x: () => 42,
      y: ({ x }) => `the x is ${x}`,
    });

    factoriesFrom(container);
    expect(isReady(container, 'x')).toBeFalsy();
    expect(isReady(container, 'y')).toBeFalsy();
  });

  it('creates a factories object from container (with symbolic names)', () => {
    const $field = Symbol('symbolic name');
    type IContainer = {
      x: number,
      [$field]: object,
    };

    const originalFactories: IFactories<IContainer> = {
      x: () => 42,
      [$field]: ({ x }) => ({ x }),
    };

    const container = diContainer(originalFactories);

    const factories = factoriesFrom(container);

    expect(allNames(factories)).toEqual(['x', $field]);

    expect(factories.x).toBeInstanceOf(Function);
    expect(factories[$field]).toBeInstanceOf(Function);

    expect(factories.x()).toBe(container.x);
    expect(factories[$field]()).toBe(container[$field]);
  });

  it('allows to merge two containers', () => {
    type IContainer1 = {
      x: number,
      y: string,
    };

    type IContainer2 = {
      z: string,
      t: number,
    }

    const container1 = diContainer<IContainer1>({
      x: () => 42,
      y: ({ x }) => `the x is ${x}`,
    });

    const container2 = diContainer<IContainer2>({
      z: () => 'the time x',
      t: ({ z }) => z.length,
    });

    const container = diContainer<IContainer1 & IContainer2>({
      ...factoriesFrom(container1),
      ...factoriesFrom(container2),
    });

    expect(container.x).toBe(container1.x);
    expect(container.y).toBe(container1.y);
    expect(container.z).toBe(container2.z);
    expect(container.t).toBe(container2.t);
  });

  it('allows to merge two containers (with symbolic names)', () => {
    const $field = Symbol('symbolic name');

    type IContainer1 = {
      x: number;
      [$field]: object;
    };

    type IContainer2 = {
      z: string;
      t: number;
    }

    const container1 = diContainer<IContainer1>({
      x: () => 42,
      [$field]: () => ({}),
    });

    const container2 = diContainer<IContainer2>({
      z: () => 'the time x',
      t: ({ z }) => z.length,
    });

    const container = diContainer({
      ...factoriesFrom(container1),
      ...factoriesFrom(container2),
    });

    expectStrictType<{
      z: string;
      t: number;
      x: number;
      [$field]: object;
    }>(container);

    expect(container.x).toBe(container1.x);
    expect(container[$field]).toBe(container1[$field]);
    expect(container[$field]).toEqual({});
    expect(container.z).toBe(container2.z);
    expect(container.t).toBe(container2.t);
  });

  it('allows to create extending container', () => {
    type IContainer1 = {
      x: number,
      y: string,
    };

    type IContainer2 = {
      z: string,
      t: number,
    }

    const container1 = diContainer<IContainer1>({
      x: () => 42,
      y: ({ x }) => `the x is ${x}`,
    });

    const container = diContainer<IContainer1 & IContainer2>({
      ...factoriesFrom(container1),
      z: ({ x, y }) => `the y is "${y}" and it contains "${x}"`,
      t: ({ z }) => z.length,
    });

    expect(container.x).toBe(container1.x);
    expect(container.y).toBe(container1.y);
    expect(container.z).toBe('the y is "the x is 42" and it contains "42"');
    expect(container.t).toBe(43);
  });
});
