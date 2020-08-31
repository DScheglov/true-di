/* eslint-disable @typescript-eslint/no-unused-vars */
import { prepareAll, releaseAll } from 'true-di';
import containerFactory from './container';
import { IContainer } from './interfaces';

type AssertTypeEqual<T1, T2> = T1 extends T2 ? (T2 extends T1 ? true : never) : never;

describe('container', () => {
  let container: IContainer;
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'trace').mockImplementation(() => {});
  });

  beforeEach(() => {
    container = containerFactory(Date.now())
  })

  afterEach(() => {
    releaseAll(container);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('allows to get logger', () => {
    expect(container.logger).toBeDefined();

    const typecheck: AssertTypeEqual<
      typeof container.logger,
      IContainer['logger'
    ]> = true;
  });

  it('allows to get dataSourceService', () => {
    expect(container.dataSourceService).toBeDefined();

    const typecheck: AssertTypeEqual<
      typeof container.dataSourceService,
      IContainer['dataSourceService']
    > = true;
  });

  it('allows to get ecommerceService', () => {
    expect(container.ecommerceService).toBeDefined();

    const typecheck: AssertTypeEqual<
      typeof container.ecommerceService,
      IContainer['ecommerceService']
    > = true;
  });

  // or just single test
  it('allows to instantiate all items', () => {
    const items = { ...container };

    expect(items.logger).toBeDefined();
    expect(items.dataSourceService).toBeDefined();
    expect(items.ecommerceService).toBeDefined();

    const typecheck: AssertTypeEqual<typeof items, IContainer> = true;
  });

  // or the same but with prepareAll
  it('allows to instantiate all items (prepareAll)', () => {
    const items = prepareAll(container);

    expect(items.logger).toBeDefined();
    expect(items.dataSourceService).toBeDefined();
    expect(items.ecommerceService).toBeDefined();

    const typecheck: AssertTypeEqual<typeof items, IContainer> = true;
  });
});
