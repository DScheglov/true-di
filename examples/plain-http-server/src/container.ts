import { IncomingMessage } from 'http';
import diContainer from 'true-di';
import logger from './Logger';
import dataSourceService from './DataSourceService';
import ecommerceService from './ECommerceService';
import { logLevelFromStr } from './Logger/LogLevel';
import { readHeader } from './utils/readHeader';

export default (req: IncomingMessage) => diContainer({
  logLevel: () => logLevelFromStr(readHeader(req, 'X-Log-Level')),
  logger,
  dataSourceService,
  ecommerceService,
});
