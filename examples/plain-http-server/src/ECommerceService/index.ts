import { strict as assert } from 'assert';
import {
  IECommerceService, IDataSourceService, Order, IInfoLogger, OrderItem,
} from '../interfaces';
import { ordersFromItems } from '../Orders';
import { isUUID } from '../utils/isUUID';

const belongsToOrder = (id: string) => ({ orderId }: OrderItem): boolean => orderId === id;

type ECommerceSeriveDeps = {
  logger: IInfoLogger,
  dataSourceService: IDataSourceService,
}

const ECommerceSerive = ({ logger, dataSourceService }: ECommerceSeriveDeps): IECommerceService => {
  logger.info('ECommerceService has been created');

  const getOrders = async (): Promise<Order[]> => {
    logger.info('getOrders has been called');

    const orderItems = await dataSourceService.getOrderItems();
    return ordersFromItems(orderItems);
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    assert(isUUID(id), `${id} is not a valid UUID`);

    logger.info('getOrderById has been called');

    const orderItems = await dataSourceService.getOrderItems(belongsToOrder(id));

    return orderItems.length > 0
      ? ordersFromItems(orderItems)[0]
      : null;
  };

  return {
    getOrders,
    getOrderById,
  };
};

export default ECommerceSerive;
