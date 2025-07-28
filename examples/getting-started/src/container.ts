import diContainer from 'true-di';
import { ILogger, IDataSourceService, IECommerceService } from './interfaces';
import ConsoleLogger from './Logger';
import FakeDataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

type IServices = {
  logger: ILogger,
  dataSourceService: IDataSourceService,
  eCommerceService: IECommerceService,
}

export default diContainer<IServices>({
  logger: () =>
    new ConsoleLogger(),

  dataSourceService: ({ logger }) =>
    new FakeDataSourceService(logger),

  eCommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),
});
