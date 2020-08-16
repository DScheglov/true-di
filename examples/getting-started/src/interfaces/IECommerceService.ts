import { Order } from '../Orders/types';

export interface IECommerceService {
  getOrders(): Promise<Order[]>
}
