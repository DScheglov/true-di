import diContainer from 'true-di';
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';
import { getOrdersFactory } from './controller';

export default (now = Date.now()) => diContainer<IContainer>({
  logger: () =>
    new Logger(now),

  dataSourceService: ({ logger }) =>
    new DataSourceService(logger),

  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),

  getOrders: getOrdersFactory,
});
