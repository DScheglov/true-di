import { createOrder, createOrderItem, ordersFromItems } from '.';
import { Order, OrderItem } from './types';

describe('Orders', () => {
  describe('createOrderItem', () => {
    it('creates an orderItem with default values', () => {
      const orderItem: OrderItem = createOrderItem();

      expect(orderItem).toEqual({
        id: null,
        orderId: null,
        sku: null,
        unitPrice: 0,
        quantity: 0,
      });
    });

    it('creates an orderItem with specified values', () => {
      const orderItem: OrderItem = createOrderItem('orderItemId', 'orderId', 'sku', 10, 1);

      expect(orderItem).toEqual({
        id: 'orderItemId',
        orderId: 'orderId',
        sku: 'sku',
        unitPrice: 10,
        quantity: 1,
      });
    });
  });

  describe('createOrder', () => {
    it('creates an Order with default values', () => {
      const order: Order = createOrder();

      expect(order).toEqual({
        id: null,
        items: [],
        total: 0,
      });
    });

    it('creates an Order with specified values', () => {
      const order: Order = createOrder('id', [], 0);

      expect(order).toEqual({
        id: 'id',
        items: [],
        total: 0,
      });
    });
  });

  describe('ordersFromItems', () => {
    it('returns empty list of orders for empty list of orderItems', () => {
      const orders: Order[] = ordersFromItems([]);

      expect(orders).toEqual([]);
    });

    it('returns single order for single orderItem', () => {
      const orderItems: OrderItem[] = [
        createOrderItem('orderItemId', 'orderId', 'sku', 10, 10),
      ];

      const orders: Order[] = ordersFromItems(orderItems);

      expect(orders).toEqual([
        createOrder('orderId', orderItems, 100),
      ]);
    });

    it('returns groups orderItems with the same id to the single order', () => {
      const orderItems: OrderItem[] = [
        createOrderItem('orderItemId-1', 'orderId', 'sku-1', 10, 10),
        createOrderItem('orderItemId-2', 'orderId', 'sku-2', 100, 2),
      ];

      const orders: Order[] = ordersFromItems(orderItems);

      expect(orders).toEqual([
        createOrder('orderId', orderItems, 300),
      ]);
    });

    it('returns groups orderItems with the different orderId to the diferent orders', () => {
      const orderItems1: OrderItem[] = [
        createOrderItem('orderItemId-1', 'orderId-1', 'sku-1', 10, 10),
        createOrderItem('orderItemId-2', 'orderId-1', 'sku-2', 100, 2),
      ];

      const orderItems2: OrderItem[] = [
        createOrderItem('orderItemId-3', 'orderId-2', 'sku-1', 50, 10),
        createOrderItem('orderItemId-4', 'orderId-2', 'sku-2', 5, 20),
      ];

      const orders: Order[] = ordersFromItems([...orderItems1, ...orderItems2]);

      expect(orders).toEqual([
        createOrder('orderId-1', orderItems1, 300),
        createOrder('orderId-2', orderItems2, 600),
      ]);
    });
  });
});
