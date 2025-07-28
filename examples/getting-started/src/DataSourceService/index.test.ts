import {
  jest, describe, it, expect,
} from '@jest/globals';
import FakeDataSourceService from '.';
import { IDataSourceService, IInfoLogger } from '../interfaces';
import fakeOrderItems from './__fake__/order-items';

const fakeLogger = {
  info: jest.fn<IInfoLogger['info']>(),
};

describe('DataSourceService', () => {
  it('allows to instantiate dataSourceService', () => {
    const dataSourceService: IDataSourceService = new FakeDataSourceService(fakeLogger);

    expect(dataSourceService).toBeInstanceOf(FakeDataSourceService);
  });

  it('prints message to log on creation', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dataSourceService: IDataSourceService = new FakeDataSourceService(fakeLogger);

    expect(fakeLogger.info).toHaveBeenCalledWith('DataSourceService has been created');
  });

  it('returns order items with method getOrderItems', async () => {
    const dataSourceService: IDataSourceService = new FakeDataSourceService(fakeLogger);

    expect(await dataSourceService.getOrderItems()).toEqual(fakeOrderItems);
  });

  it('returns filtered list of order items with method getOrderItems', async () => {
    const dataSourceService: IDataSourceService = new FakeDataSourceService(fakeLogger);

    expect(await dataSourceService.getOrderItems(
      ({ id }) => id === fakeOrderItems[0].id,
    )).toEqual([fakeOrderItems[0]]);
  });
});
