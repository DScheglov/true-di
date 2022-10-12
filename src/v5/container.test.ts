import createContainerFactory from './container-factory';
import { singleton } from './singleton-scope';
import { transient } from './transient-scope';

describe('createContainer', () => {
  it('allows to create an empty container', () => {
    const container = createContainerFactory({}, {})({});
    expect(container).toEqual({});
  });

  it('allows to create container with constants', () => {
    const container = createContainerFactory<{ x: number, y: string }, { z: string}>({
      x: () => 1,
      y: () => 'line',
    }, {
      z: ({ x, y }) => `${y} #${x}`,
    })({});

    expect(container).toEqual({ z: 'line #1' });
  });

  it('keeps module scope to create container with constants', () => {
    let index = 0;

    const container = createContainerFactory<{ x: number, y: string }, { z: string}>({
      x: () => ++index, // eslint-disable-line no-plusplus
      y: () => 'line',
    }, {
      z: ({ x, y }) => `${y} #${x}`,
    })({});

    expect(container.z).toEqual('line #1');
    expect(container.z).toEqual('line #1');
  });

  it('keeps transient scope to create container with constants', () => {
    let index = 0;

    const container = createContainerFactory<{ x: number, y: string }, { z: string}>({
      x: transient(() => ++index), // eslint-disable-line no-plusplus
      y: () => 'line',
    }, {
      z: ({ x, y }) => `${y} #${x}`,
    })({});

    expect(container.z).toEqual('line #1');
    expect(container.z).toEqual('line #2');
  });

  it('keeps singleton scope to create container with constants', () => {
    let index = 0;

    const node = () => ({
      index: ++index, // eslint-disable-line no-plusplus
    });

    const factory = createContainerFactory<{ x: { index: number }, y: string }, { z: string}>({
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
});
