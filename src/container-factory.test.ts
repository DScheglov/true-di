import { asyncScope, run } from './async-scope';
import createContainerFactory from './container-factory';
import createSessionScope from './session-scope';
import { singleton } from './singleton-scope';
import { transient } from './transient-scope';

const isPromise = (value: any): value is Promise<any> => value != null && typeof value.then === 'function';

const withRun = <T>(cb: () => T | Promise<T>) =>
  new Promise<T>((resolve, reject) => {
    setTimeout(() => run(() => {
      try {
        const result = cb();
        return isPromise(result) ? result.then(resolve, reject) : resolve(result);
      } catch (err) {
        return reject(err);
      }
    }));
  });

describe('createContainer', () => {
  it('allows to create an empty container', () => {
    const container = createContainerFactory({}, {})({});
    expect(container).toEqual({});
  });

  it('allows to create container with constants', () => {
    const container = createContainerFactory<{ x: number, y: string }, { z: string }, {}>({
      x: () => 1,
      y: () => 'line',
    }, {
      z: ({ x, y }) => `${y} #${x}`,
    })({});

    expect(container).toEqual({ z: 'line #1' });
  });

  it('keeps module scope', () => {
    let index = 0;

    const container = createContainerFactory<{ x: number, y: string }, { z: string }, {}>({
      x: () => ++index, // eslint-disable-line no-plusplus
      y: () => 'line',
    }, {
      z: ({ x, y }) => `${y} #${x}`,
    })({});

    expect(container.z).toEqual('line #1');
    expect(container.z).toEqual('line #1');
  });

  it('keeps transient scope', () => {
    let index = 0;

    const container = createContainerFactory<{ x: number, y: string }, { z: string }, {}>({
      x: transient(() => ++index), // eslint-disable-line no-plusplus
      y: () => 'line',
    }, {
      z: ({ x, y }) => `${y} #${x}`,
    })({});

    expect(container.z).toEqual('line #1');
    expect(container.z).toEqual('line #2');
  });

  it('keeps singleton scope', () => {
    let index = 0;

    const node = () => ({
      index: ++index, // eslint-disable-line no-plusplus
    });

    const factory = createContainerFactory<{ x: { index: number }, y: string }, { z: string }, {}>({
      x: singleton(() => node()),
      y: () => 'line',
    }, {
      z: ({ x, y }) => `${y} #${x.index}`,
    });

    const container = factory({});
    const container2 = factory({});

    expect(container.z).toEqual('line #1');
    expect(container.z).toEqual('line #1');
    expect(container2.z).toEqual('line #1');
  });

  it('keeps async scope', async () => {
    expect.assertions(5);

    let index = 0;
    type Node<T> = { value: T };
    const node = <T>(value: T) => ({ value });

    const container = createContainerFactory<
      { x: number, y: string },
      { z: string, n: Node<string> },
      {}
    >({
      x: asyncScope(() => ++index), // eslint-disable-line no-plusplus
      y: () => 'line',
    }, {
      z: ({ x, y }) => `${y} #${x}`,
      n: ({ z }) => node(z),
    })({});

    const z1 = await withRun<string>(() => (container.z));
    const z2 = await withRun<string>(() => (container.z));
    const result = await withRun<[string, string]>(() => [container.z, container.z]);
    const [n1, n2] = await withRun<[Node<string>, Node<string>]>(() => Promise.all([
      container.n,
      new Promise<Node<string>>(resolve => { setTimeout(() => resolve(container.n)); }),
    ]));

    expect(z1).toEqual('line #1');
    expect(z2).toEqual('line #2');
    expect(result).toEqual(['line #3', 'line #3']);
    expect(n1).toBe(n2);
    expect(n1).toEqual({ value: 'line #4' });
  });

  it('keeps session scope', () => {
    const { sessionScope } = createSessionScope(
      (_: any, { sessionId }: { sessionId: string}) => sessionId,
      0.1,
      (cb: () => void) => setTimeout(cb, 50),
    );

    type Module = {
      session: { id: string, close: () => void };
      closeSession: () => void;
    };

    const createContainer = createContainerFactory<{}, Module, { sessionId: string }>(
      {},
      {
        session: sessionScope(
          (int: any, ext: any, { id, close }) => ({ id, close }),
        ),
        closeSession: ({ session }) => () => session.close(),
      },
    );

    const container1 = createContainer({ sessionId: '1' });
    const container2 = createContainer({ sessionId: '1' });
    const conatiner3 = createContainer({ sessionId: '2' });

    expect(container1.session).toBe(container2.session);
    expect(container1.session).not.toBe(conatiner3.session);
  });
});
