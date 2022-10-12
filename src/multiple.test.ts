import diContainer from './service-locator';
import multiple from './multiple';

describe('multiple', () => {
  it('decorates a factory', () => {
    type IContainer = {
      datetime: number,
    };

    const factoryTuple = multiple<IContainer, {}, 'datetime'>(
      () => Date.now(),
    );

    expect(factoryTuple).toBeInstanceOf(Array);
    expect(factoryTuple[0]).toBeInstanceOf(Function);
    expect(factoryTuple[1]).toBeInstanceOf(Function);
  });

  it('could be used to multiplicate container item (factory)', () => {
    type IContainer = {
      index: number,
    };

    let counter = 0;
    const container = diContainer<IContainer>({
      index: multiple(() => ++counter), // eslint-disable-line no-plusplus
    })();

    expect(container.index).toBeDefined();
    expect(container.index).not.toBe(container.index);
  });

  it('decorates a factory tuple', () => {
    type IContainer = {
      datetime: number,
    };

    const factoryTuple = multiple<IContainer, {}, 'datetime'>(
      [() => Date.now(), () => {}],
    );

    expect(factoryTuple).toBeInstanceOf(Array);
    expect(factoryTuple[0]).toBeInstanceOf(Function);
    expect(factoryTuple[1]).toBeInstanceOf(Function);
  });

  it('could be used to multiplicate container item (factory tuple)', () => {
    type Node = {
      index: number,
      parent: Node | null,
      children: Node[],
    }

    type IContainer = {
      index: number,
      node: Node,
      root: Node,
    };

    let counter = 0;
    const container = diContainer<IContainer>({
      index: multiple(() => ++counter), // eslint-disable-line no-plusplus
      node: multiple([
        ({ index }) => ({ index, parent: null, children: [] }),
        (node, { root }) => {
          if (node === root) return;
          node.parent = root;
          root.children.push(node);
        },
      ]),
      root: ({ node }) => node,
    })();

    expect(container.root).toEqual({ index: 1, parent: null, children: [] });

    expect([
      container.node,
      container.node,
      container.node,
    ]).toEqual(container.root.children);

    expect(container.root).toEqual({
      index: 1,
      parent: null,
      children: [
        { index: 2, parent: container.root, children: [] },
        { index: 3, parent: container.root, children: [] },
        { index: 4, parent: container.root, children: [] },
      ],
    });
  });

  it('could be used to decorate whole factories', () => {
    type Node = {
      index: number,
    }

    type IContainer = {
      index: number,
      node: Node,
    };

    let counter = 0;
    const container = diContainer(multiple<IContainer, {}>({
      index: () => ++counter, // eslint-disable-line no-plusplus
      node: ({ index }) => ({ index }),
    }))();

    expect(container.node).toEqual({ index: 1 });
    expect(container.node).toEqual({ index: 2 });
    expect(container.node).toEqual({ index: 3 });
  });
});
