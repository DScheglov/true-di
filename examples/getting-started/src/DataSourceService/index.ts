import { IDataSourceService, IInfoLogger, OrderItem } from '../interfaces';
import fakeOrderItems from './__fake__/order-items';

class DataSourceService implements IDataSourceService {
  private readonly _data: OrderItem[] = fakeOrderItems;

  constructor(_logger: IInfoLogger) {
    _logger.info('DataSourseService has been created');
  }

  getOrderItems(predicate?: (orderItem: OrderItem) => boolean): Promise<OrderItem[]> {
    return Promise.resolve(
      typeof predicate === 'function'
        ? this._data.filter(predicate)
        : this._data,
    );
  }
}

export default DataSourceService;
