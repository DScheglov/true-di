import { Order } from '../Orders/types';

export interface IGetOrders {
  getOrders(): Promise<Order[]>
}

export interface IGetOrderById {
  getOrderById(id: string): Promise<Order | null>
}

export interface IECommerceService extends
  IGetOrders,
  IGetOrderById
{}
