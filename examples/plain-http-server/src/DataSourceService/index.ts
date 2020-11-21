import { IDataSourceService, IInfoLogger, OrderItem } from '../interfaces';
import fakeOrderItems from './__fake__/order-items';

type DataSourceServiceDeps = {
  logger: IInfoLogger,
}

const DataSourceService = ({ logger }: DataSourceServiceDeps): IDataSourceService => {
  logger.info('DataSourseService has been created');

  const data = fakeOrderItems;

  const getOrderItems = (predicate?: (orderItem: OrderItem) => boolean): Promise<OrderItem[]> =>
    Promise.resolve(
      typeof predicate === 'function' ? data.filter(predicate) : data,
    );

  return {
    getOrderItems,
  };
};

export default DataSourceService;
