import { groupBy } from '../utils/groupBy';
import { Order, OrderItem } from './types';

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const createOrderItem = (
  id: string = '',
  orderId: string = '',
  sku: string = '',
  unitPrice: number = 0,
  quantity: number = 0,
): OrderItem => ({
  id, orderId, sku, unitPrice, quantity,
});

const orderItemPrice = ({ unitPrice, quantity }: OrderItem): number =>
  round2(unitPrice * quantity);

export const createOrder = (
  id: string = '',
  items: OrderItem[] = [],
  total: number = 0,
): Order => ({ id, items, total });

export const ordersFromItems = groupBy(
  ({ orderId }: OrderItem) => orderId,
  (order: Order = createOrder(), orderItem) => { // eslint-disable-line default-param-last
    order.id = orderItem.orderId;
    order.items.push(orderItem);
    order.total = round2(order.total + orderItemPrice(orderItem));
    return order;
  },
);
