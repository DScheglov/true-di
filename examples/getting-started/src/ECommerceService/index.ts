import { strict as assert } from 'assert';
import {
  IECommerceService, IDataSourceService, Order, IInfoLogger,
} from '../interfaces';
import { ordersFromItems } from '../Orders';
import { isUUID } from '../utils/isUUID';

class ECommerceService implements IECommerceService {
  readonly #logger: IInfoLogger;

  readonly #dataSourceService: IDataSourceService;

  constructor(
    logger: IInfoLogger,
    dataSourceService: IDataSourceService,
  ) {
    this.#logger = logger;
    this.#dataSourceService = dataSourceService;
    logger.info('ECommerceService has been created');
  }

  async getOrders(): Promise<Order[]> {
    this.#logger.info('getOrders has been called');

    const orderItems = await this.#dataSourceService.getOrderItems();

    return ordersFromItems(orderItems);
  }

  async getOrderById(id: string): Promise<Order | null> {
    assert(isUUID(id), `${id} is not a valid UUID`);

    this.#logger.info('getOrderById has been called');

    const orderItems = await this.#dataSourceService.getOrderItems(
      ({ orderId }) => orderId === id,
    );

    return orderItems.length > 0
      ? ordersFromItems(orderItems)[0]
      : null;
  }
}

export default ECommerceService;
