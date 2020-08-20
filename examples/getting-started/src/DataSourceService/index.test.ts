import DataSourceService from '.';
import { IDataSourceService, ILogger } from '../interfaces';
import fakeOrderItems from './__fake__/order-items';

const fakeLogger: ILogger = {
  info: jest.fn(),
} as any;

describe('DataSourceService', () => {
  it('allows to instantiate dataSourceService', () => {
    const dataSourceService: IDataSourceService = new DataSourceService(fakeLogger);

    expect(dataSourceService).toBeInstanceOf(DataSourceService);
  });

  it('prints message to log on creation', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dataSourceService: IDataSourceService = new DataSourceService(fakeLogger);

    expect(fakeLogger.info).toHaveBeenCalledWith('DataSourseService has been created');
  });

  it('returns order items with method getOrderItems', async () => {
    const dataSourceService: IDataSourceService = new DataSourceService(fakeLogger);

    expect(await dataSourceService.getOrderItems()).toEqual(fakeOrderItems);
  });
});
