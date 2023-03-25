import type { Equal, Expect } from '@type-challenges/utils';
import { asUseCases } from './as-use-cases';
import Module from './module';
import scope from './scope';

describe('module', () => {
  it('is possible to create an empty module builder', () => {
    const moduleBuilder = Module();

    expect(moduleBuilder).toBeDefined();
  });

  it('is impossible to create an empty module', () => {
    const module = Module();

    expect((module as any).create).not.toBeDefined();
  });

  it('is possible to create a module with a constant item', () => {
    const module = Module().public({
      number: () => 1,
    }).create();

    type cases = [ // eslint-disable-line @typescript-eslint/no-unused-vars
      Expect<Equal<typeof module, { number: number }>>, //
    ];
    expect(module).toEqual({ number: 1 });
  });

  it('is possible to create a simple calculator', () => {
    const module = Module()
      .private({ x: () => 1 as const })
      .private({ y: () => 2 as const })
      .public({ z: ({ x, y }) => x + y })
      .create();

    expect(module).toEqual({ z: 3 });
  });

  it('is possible to create a parameterized module', () => {
    const Messaging = Module()
      .private({
        greeting: (_, { name }: { name: string }) => `Hello, ${name}`,
      }).public({
        message: ({ greeting }) => (body: string) => `${greeting}\n\n${body}`,
      });

    const module1 = Messaging.create({ name: 'Thomas' });
    const module2 = Messaging.create({ name: 'Peter' });

    expect(module1.message('Call mama!')).toBe('Hello, Thomas\n\nCall mama!');
    expect(module2.message('Great Job!')).toBe('Hello, Peter\n\nGreat Job!');
  });

  it('is possible to create a module with transient item', () => {
    let count = 0;
    const module = Module()
      .public(scope.transient, {
        next: () => ++count, // eslint-disable-line no-plusplus
      }).create();

    expect(module.next).toBe(1);
    expect(module.next).toBe(2);
  });

  it('is possible to create a module with singleton item', () => {
    let count = 0;
    const module = Module()
      .public(scope.singleton, {
        const: () => ++count, // eslint-disable-line no-plusplus
      });

    expect(module.create().const).toBe(1);
    expect(module.create().const).toBe(1);

    expect(count).toBe(1);
  });

  it('extrapolates scope for dependent items', () => {
    let count: number = 0;
    const module = Module()
      .private(scope.transient, {
        index: () => ++count, // eslint-disable-line no-plusplus
      })
      .public({
        name: ({ index }) => `Item #${index}`,
      })
      .create();

    expect(module.name).toBe('Item #1');
    expect(module.name).toBe('Item #2');
  });

  it('is possible to prevent scope extrapolation', () => {
    let count: number = 0;
    const module = Module()
      .private(scope.transient, {
        index: () => ++count, // eslint-disable-line no-plusplus
      })
      .public(scope.module, {
        name: ({ index }) => `Item #${index}`,
      })
      .create();

    expect(module.name).toBe('Item #1');
    expect(module.name).toBe('Item #1');
  });

  it('is possible to use async scope', async () => {
    let count: number = 0;
    const module = Module()
      .public(scope.async, {
        index: () => ++count, // eslint-disable-line no-plusplus
      })
      .create();

    const indexes1 = await new Promise(resolve => {
      scope.async.run(() => {
        resolve([module.index, module.index]);
      });
    });

    const indexes2 = await new Promise(resolve => {
      scope.async.run(() => {
        resolve([module.index, module.index]);
      });
    });

    expect(indexes1).toEqual([1, 1]);
    expect(indexes2).toEqual([2, 2]);
  });

  it('extrapolates async scope to dependent items', async () => {
    let count: number = 0;
    const module = Module()
      .public(scope.async, {
        index: () => ++count, // eslint-disable-line no-plusplus
      })
      .public({
        name: ({ index }) => `Item #${index}`,
      })
      .create();

    const obj1 = await new Promise(resolve => {
      scope.async.run(() => {
        const { index, name } = module;
        resolve({ index, name });
      });
    });

    const obj2 = await new Promise(resolve => {
      scope.async.run(() => {
        const { index, name } = module;
        resolve({ index, name });
      });
    });

    expect(obj1).toEqual({ index: 1, name: 'Item #1' });
    expect(obj2).toEqual({ index: 2, name: 'Item #2' });
  });

  it('is possible prevent async scope extrapolation with module.scope', async () => {
    let count: number = 0;
    const module = Module()
      .public(scope.async, {
        index: () => ++count, // eslint-disable-line no-plusplus
      })
      .public(scope.module, {
        name: ({ index }) => `Item #${index}`,
      })
      .create();

    const obj1 = await new Promise(resolve => {
      scope.async.run(() => {
        const { index, name } = module;
        resolve({ index, name });
      });
    });

    const obj2 = await new Promise(resolve => {
      scope.async.run(() => {
        const { index, name } = module;
        resolve({ index, name });
      });
    });

    expect(obj1).toEqual({ index: 1, name: 'Item #1' });
    expect(obj2).toEqual({ index: 2, name: 'Item #1' });
  });

  it('is possible to create a module from module', () => {
    const root = Module()
      .private({ x: () => 1 })
      .private({ y: () => 2 });

    const main = Module.from(root)
      .public({ z: ({ x, y }) => x + y })
      .create();

    expect(main.z).toBe(3);
  });

  it('is possible to extend module', () => {
    const root1 = Module()
      .private(scope.singleton, {
        x: (_, { v }: { v: number }) => `${v}` as const,
      })
      .private({ y: () => 'y' as const });

    const root2 = Module()
      .private({ z: () => 1 as const })
      .private({ t: () => 2 as const });

    const main = Module()
      .extendWith(root1, { asPublic: true })
      .extendWith(root2)
      .public({ res: ({ x, y, z, t }) => `${x}: ${z}, ${y}: ${t}` as const })
      .create({ v: 2 });

    expect(main.x).toBe('2');
    expect(main.y).toBe('y');
    expect(main.res).toBe('2: 1, y: 2');
  });

  it('is possible to create the use cases items', () => {
    const module = Module()
      .private({ x: () => 1 })
      .private({ y: () => 2 })
      .public({
        z: asUseCases({
          sum: (factor: number) => ({ x, y }) => factor * (x + y),
          diff: (factor: number) => ({ x, y }) => factor * (x - y),
        }),
      })
      .create();

    expect(module.z.sum(1)).toBe(3);
    expect(module.z.diff(2)).toBe(-2);
  });

  it('is possible to create the use cases items (with extracted use cases)', () => {
    type Deps = { x: number, y: number, t?: number }
    const sum = (factor: number) => ({ x, y }: Deps) => factor * (x + y);
    const diff = (factor: number) => ({ x, y }: Deps) => factor * (x - y);

    const module = Module()
      .private({ x: () => 1 })
      .private({ y: () => 2 })
      .public({ z: asUseCases({ sum, diff }) })
      .create();

    expect(module.z.sum(1)).toBe(3);
    expect(module.z.diff(2)).toBe(-2);
  });

  it('is possible to resolve cyclic dependencies', () => {
    type TNode = {
      value: number,
      parent: TNode | null;
      child: TNode | null;
    }

    const node = (value: number): TNode => ({ value, parent: null, child: null });

    const module = Module()
      .public({ a: (_, { a }: { a: number }) => node(a) })
      .public({ b: (_, { b }: { b: number }) => node(b) })
      .init({
        a(a, { b }) { a.child = b; },
        b(b, { a }) { b.parent = a; },
      })
      .create({ a: 2, b: 3 });

    expect(module.a).toEqual({
      value: 2,
      parent: null,
      child: module.b,
    });

    expect(module.b).toEqual({
      value: 3,
      parent: module.a,
      child: null,
    });
  });
});
