import { ILogger } from './ILogger';
import { IDataSourceService } from './IDataSourceService';
import { IECommerceService } from './IECommerceService';

export interface IContainer {
  logger: ILogger,
  dataSourceService: IDataSourceService,
  ecommerceService: IECommerceService,
  getOrders(req: Express.Request, res: Express.Response): void,
}
