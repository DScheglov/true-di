import diContainer from 'true-di';
import { ILogger, IDataSourceService, IECommerceService } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

type IServices = {
  logger: ILogger,
  dataSourceService: IDataSourceService,
  ecommerceService: IECommerceService,
}

export default diContainer<IServices>({
  logger: () =>
    new Logger(),

  dataSourceService: ({ logger }) =>
    new DataSourceService(logger),

  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),
});
