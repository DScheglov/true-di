import { groupBy } from '../utils/groupBy';
import { Order, OrderItem } from './types';

const round2 = (value: number): number => Math.round(value * 100) / 100;

export const createOrderItem = (
  id: string = null,
  orderId: string = null,
  sku: string = null,
  unitPrice: number = 0,
  quantity: number = 0,
): OrderItem => ({
  id, orderId, sku, unitPrice, quantity,
});

const orderItemPrice = ({ unitPrice, quantity }: OrderItem): number =>
  round2(unitPrice * quantity);

export const createOrder = (
  id: string = null,
  items: OrderItem[] = [],
  total: number = 0,
): Order => ({ id, items, total });

export const ordersFromItems = groupBy(
  ({ orderId }: OrderItem) => orderId,
  (order: Order = createOrder(), orderItem) => {
    order.id = orderItem.orderId;
    order.items.push(orderItem);
    order.total = round2(order.total + orderItemPrice(orderItem));
    return order;
  },
);
