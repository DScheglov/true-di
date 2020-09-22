import { strict as assert } from 'assert';
import {
  IECommerceService, IDataSourceService, Order, IInfoLogger,
} from '../interfaces';
import { ordersFromItems } from '../Orders';
import { isUUID } from '../utils/isUUID';

class ECommerceSerive implements IECommerceService {
  constructor(
    private readonly _logger: IInfoLogger,
    private readonly _dataSourceService: IDataSourceService,
  ) {
    _logger.info('ECommerceService has been created');
  }

  async getOrders(): Promise<Order[]> {
    const { _logger, _dataSourceService } = this;

    _logger.info('getOrders has been called');

    const orderItems = await _dataSourceService.getOrderItems();

    return ordersFromItems(orderItems);
  }

  async getOrderById(id: string): Promise<Order | null> {
    assert(isUUID(id), `${id} is not a valid UUID`);

    const { _logger, _dataSourceService } = this;

    _logger.info('getOrderById has been called');

    const orderItems = await _dataSourceService.getOrderItems(
      ({ orderId }) => orderId === id,
    );

    return orderItems.length > 0
      ? ordersFromItems(orderItems)[0]
      : null;
  }
}

export default ECommerceSerive;
