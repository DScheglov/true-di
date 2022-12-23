import Module from '../../../src/module';
import createSessionScope from '../../../src/session-scope';
import { transient } from '../../../src/transient-scope';
import { singleton } from '../../../src/singleton-scope';
import DataSourceService from './DataSourceService';
import ECommerceSerive from './ECommerceService';
import { IInfoLogger } from './interfaces';
import Logger from './Logger';

const { sessionScope } = createSessionScope(
  (_, { sessionId }: { sessionId: string}) => sessionId,
  0.1,
  (cb: () => void) => setTimeout(cb, 50),
);

const greeting = (
  { logger }: { logger: IInfoLogger },
  { name }: { name: string },
) => () => {
  const message = `Hello, ${name}!!`;
  logger.info('Say Hi has been created!');
  return message;
};

const mdl = Module()
  .private(singleton, {
    logger: () => new Logger(),
  })
  .private(transient, {
    sayHi: greeting,
  })
  .private({
    data: ({ logger }) => new DataSourceService(logger),
  })
  .private(sessionScope, {
    session: ((internal, external, { id, close }) => ({ id, close })),
  })
  .private({
    ecom: ({ logger, data }) => new ECommerceSerive(logger, data),
  })
  .init({
    logger(instance, { session }) {
      instance.info(session.id);
    },
  })
  .useCases({
    hiAndGetOrders: (message: string) => services => {
      services.logger.info(message);
      return services.ecom.getOrders();
    },
  });

async function main() {
  const commerce = mdl.create({ name: 'Dima', sessionId: '1' });

  console.log(
    await commerce.hiAndGetOrders('Getting Orders'),
  );
}

main();
