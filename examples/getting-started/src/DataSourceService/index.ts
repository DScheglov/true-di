import { IDataSourceService, IInfoLogger, OrderItem } from '../interfaces';
import fakeOrderItems from './__fake__/order-items';

class FakeDataSourceService implements IDataSourceService {
  readonly #data: OrderItem[] = fakeOrderItems;

  constructor(_logger: IInfoLogger) {
    _logger.info('DataSourceService has been created');
  }

  getOrderItems(predicate?: (orderItem: OrderItem) => boolean): Promise<OrderItem[]> {
    return Promise.resolve(
      typeof predicate === 'function'
        ? this.#data.filter(predicate)
        : this.#data,
    );
  }
}

export default FakeDataSourceService;
