import { IECommerceService, ILogger, IDataSourceService, Order } from '../interfaces';
import { ordersFromItems } from "../Orders";

class ECommerceSerive implements IECommerceService {
  constructor(
    private readonly _logger: ILogger,
    private readonly _dataSourceService: IDataSourceService,
  ) {
    _logger.info('ECommerceService has been created');
  }

  async getOrders(): Promise<Order[]> {
    const { _logger, _dataSourceService } = this;

    _logger.info('getOrders called');

    const orderItems = await _dataSourceService.getOrderItems();

    return ordersFromItems(orderItems);
  }
}

export default ECommerceSerive;
