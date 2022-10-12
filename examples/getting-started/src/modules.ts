import { DepsOf, Run } from '../../../src/bind-with-run-in-context';
import Module from '../../../src/module';
import { multiple } from '../../../src';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';
import { IGetOrders, IInfoLogger } from './interfaces';
import Logger from './Logger';

type WelcomeDeps = {
  logger: IInfoLogger;
  reader: () => string;
}
const welcome = () => ({ logger }: WelcomeDeps) => logger.info('Welcome');

type GetOrdersDeps = {
  ecommerceService: IGetOrders
}

const getOrders = () =>
  ({ ecommerceService }: GetOrdersDeps, run: Run<DepsOf<typeof welcome>>) => {
    run(welcome());
    return ecommerceService.getOrders();
  };

export const { create } = Module()
  .private({
    logger: multiple(() => new Logger()),
    reader: () => () => 'Hello!!',
  })
  .private({
    dataSourceService: ({ logger }) => new DataSourceService(logger),
  })
  .private({
    ecommerceService: ({ logger, dataSourceService }) =>
      new ECommerceService(logger, dataSourceService),
  })
  .useCases({
    welcome,
    getOrders,
  });

async function main() {
  const { getOrders, welcome } = create();
  console.log('Module has been created');
  welcome();
  console.log(await getOrders());
}

main();
