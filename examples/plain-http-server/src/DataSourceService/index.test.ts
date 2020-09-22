import DataSourceService from '.';
import { IDataSourceService, IInfoLogger } from '../interfaces';
import fakeOrderItems from './__fake__/order-items';

const fakeLogger: IInfoLogger = {
  info: jest.fn(),
};

describe('DataSourceService', () => {
  it('prints message to log on creation', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dataSourceService: IDataSourceService = DataSourceService({ logger: fakeLogger });

    expect(fakeLogger.info).toHaveBeenCalledWith('DataSourseService has been created');
  });

  it('returns order items with method getOrderItems', async () => {
    const dataSourceService: IDataSourceService = DataSourceService({ logger: fakeLogger });

    expect(await dataSourceService.getOrderItems()).toEqual(fakeOrderItems);
  });

  it('returns filtered list of order items with method getOrderItems', async () => {
    const dataSourceService: IDataSourceService = DataSourceService({ logger: fakeLogger });

    expect(await dataSourceService.getOrderItems(
      ({ id }) => id === fakeOrderItems[0].id,
    )).toEqual([fakeOrderItems[0]]);
  });
});
