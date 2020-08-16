import { IDataSourceService, ILogger, OrderItem } from '../interfaces';
import fakeOrderItems from "./fake-order-items";

class DataSourceService implements IDataSourceService {
  constructor(_logger: ILogger) {
    _logger.info('DataSourseService has been created');
  }
  
  getOrderItems(): Promise<OrderItem[]> {
    return Promise.resolve(fakeOrderItems);
  }
}

export default DataSourceService;

/// some data to play with

