import diContainer from 'true-di';
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

export default diContainer<IContainer>({
  logger: () =>
    new Logger(),

  dataSourceService: ({ logger }) =>
    new DataSourceService(logger),

  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),
});
