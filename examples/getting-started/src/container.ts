import diContainer from 'true-di';
import createAsyncContext from '../../../src/async-context';
import { ILogger, IDataSourceService, IECommerceService } from './interfaces';
import Logger, { LogLevel } from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';
import ordersController from './controller';

type IServices = {
  logger: ILogger,
  dataSourceService: IDataSourceService,
  ecommerceService: IECommerceService,
  ordersController: ReturnType<typeof ordersController>;
}

const { asyncContext, run } = createAsyncContext({ logLevel: LogLevel.INFO, traceId: undefined });

export { run };

export default diContainer<IServices>({
  logger: asyncContext(
    (_, { logLevel, traceId }) => new Logger(logLevel, traceId),
  ),

  dataSourceService: ({ logger }) =>
    new DataSourceService(logger),

  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),

  ordersController,
});
