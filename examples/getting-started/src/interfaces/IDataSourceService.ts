import { OrderItem } from '../Orders/types';

export interface IDataSourceService {
  getOrderItems(predicate?: (orderItem: OrderItem) => boolean): Promise<OrderItem[]>
}
