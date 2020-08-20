import { ILogger } from './ILogger';
import { IDataSourceService } from './IDataSourceService';
import { IECommerceService } from './IECommerceService';

export interface IContainer {
  logger: ILogger,
  dataSourceService: IDataSourceService,
  ecommerceService: IECommerceService,
}
