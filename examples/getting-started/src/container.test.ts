/* eslint-disable @typescript-eslint/no-unused-vars */
import { prepareAll, releaseAll } from 'true-di';
import container from './container';
import { IDataSourceService, IECommerceService, ILogger } from './interfaces';

type AssertTypeEqual<T1, T2> = T1 extends T2 ? (T2 extends T1 ? true : never) : never;

describe('container', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    releaseAll(container);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('allows to get logger', () => {
    expect(container.logger).toBeDefined();

    const typecheck: AssertTypeEqual<typeof container.logger, ILogger> = true;
  });

  it('allows to get dataSourceService', () => {
    expect(container.dataSourceService).toBeDefined();

    const typecheck: AssertTypeEqual<typeof container.dataSourceService, IDataSourceService> = true;
  });

  it('allows to get ecommerceService', () => {
    expect(container.ecommerceService).toBeDefined();

    const typecheck: AssertTypeEqual<typeof container.ecommerceService, IECommerceService> = true;
  });

  // or just single test
  it('allows to instantiate all items', () => {
    const items = { ...container };

    expect(items.logger).toBeDefined();
    expect(items.dataSourceService).toBeDefined();
    expect(items.ecommerceService).toBeDefined();

    const typecheck: AssertTypeEqual<
      typeof items, {
        logger: ILogger,
        dataSourceService: IDataSourceService,
        ecommerceService: IECommerceService,
      }> = true;
  });

  // or the same but with prepareAll
  it('allows to instantiate all items (prepareAll)', () => {
    const items = prepareAll(container);

    expect(items.logger).toBeDefined();
    expect(items.dataSourceService).toBeDefined();
    expect(items.ecommerceService).toBeDefined();

    const typecheck: AssertTypeEqual<
      typeof items, {
        logger: ILogger,
        dataSourceService: IDataSourceService,
        ecommerceService: IECommerceService,
      }> = true;
  });
});
