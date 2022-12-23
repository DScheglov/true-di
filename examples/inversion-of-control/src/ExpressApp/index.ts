import { randomUUID } from 'crypto';
import type { Application } from 'express';
import { run } from '../../../../src/async-scope';
import { IContextManager, IExpressErrorHandler, IOrdersExpressController } from '../interfaces';

const ExpressApp = (
  express: () => Application,
  { getOrders, getOrderById }: IOrdersExpressController,
  { handleErrors }: IExpressErrorHandler,
  { setRequestId }: IContextManager,
): Application => {
  const app = express();

  app.use((req, res, next) => run(() => {
    const rid = req.headers['x-request-id'];
    setRequestId(Array.isArray(rid) ? rid[0] : rid ?? randomUUID());
    next();
  }));

  app.get('/orders', getOrders);
  app.get('/orders/:id', getOrderById);

  app.use(handleErrors);

  return app;
};

export default ExpressApp;
