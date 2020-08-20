import { OrderItem } from '../Orders/types';

export interface IDataSourceService {
  getOrderItems(): Promise<OrderItem[]>
}
