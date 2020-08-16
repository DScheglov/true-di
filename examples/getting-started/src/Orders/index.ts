import { groupBy } from "../utils/groupBy";
import { Order, OrderItem } from './types';

export const createOrderItem = (
  id: string = null,
  orderId: string = null, 
  sku: string = null, 
  unitPrice: number = 0, 
  quantity: number = 0
): OrderItem => ({ id, orderId, sku, unitPrice, quantity });

export const createOrder = (
  id: string = null,
  items: OrderItem[] = [],
  total: number = 0
): Order => ({ id, items, total });

const createOrdersMap = groupBy(
  ({ orderId }: OrderItem) => orderId,
  (order: Order = createOrder(), orderItem) => {
    order.id = orderItem.orderId;
    order.items.push(orderItem);
    order.total += orderItem.unitPrice * orderItem.quantity;
    return order;
  },
);

export const ordersFromItems = (orderItems: OrderItem[]): Order[] => Array.from(
  createOrdersMap(orderItems).values()
);