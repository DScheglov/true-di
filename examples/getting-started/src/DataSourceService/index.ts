import { IDataSourceService, ILogger, OrderItem } from '../interfaces';
import fakeOrderItems from './__fake__/order-items';

class DataSourceService implements IDataSourceService {
  private readonly _data: OrderItem[] = fakeOrderItems;

  constructor(_logger: ILogger) {
    _logger.info('DataSourseService has been created');
  }

  getOrderItems(): Promise<OrderItem[]> {
    return Promise.resolve(this._data);
  }
}

export default DataSourceService;
