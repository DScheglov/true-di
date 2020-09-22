/* eslint-disable @typescript-eslint/no-unused-vars */
import { IncomingMessage } from 'http';
import { prepareAll, releaseAll } from 'true-di';
import createContainer from './container';
import { IDataSourceService, IECommerceService, ILogger } from './interfaces';
import { LogLevel } from './Logger/LogLevel';

type AssertTypeEqual<T1, T2> = T1 extends T2 ? (T2 extends T1 ? true : never) : never;

describe('container', () => {
  let container: ReturnType<typeof createContainer>;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  beforeEach(() => {
    container = createContainer({ headers: {} } as IncomingMessage)
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
        logLevel: LogLevel,
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
        logLevel: LogLevel,
        logger: ILogger,
        dataSourceService: IDataSourceService,
        ecommerceService: IECommerceService,
      }> = true;
  });
});
