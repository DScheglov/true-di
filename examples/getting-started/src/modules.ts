import Module from '../../../src/module';
import DataSourceService from './DataSourceService';
import Logger from './Logger';

const container = Module()
  .private({ logger: () => new Logger() })
  .public({ dataSourceService: ({ logger }) => new DataSourceService(logger) })
  .init({
    logger(logger, { dataSourceService }) {
      logger.info(`DataSourceService created ${String(dataSourceService)}`);
    },
  })
  .create();
