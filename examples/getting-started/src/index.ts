import express from 'express';

import container, { run } from './container';
import Logger from './Logger';
import { handleErrors } from './middlewares';
import { first } from './utils/first';

const app = express();

app.use((req, res, next) => run({
  logLevel: Logger.parseLogLevel(first(req.headers['x-log-level'])),
  traceId: first(req.headers['x-trace-id']),
}, next));

app.get('/orders', container.ordersController.getOrders);
app.get('/orders/:id', container.ordersController.getOrderById);

app.use(handleErrors(container));

if (module === require.main) {
  app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
    console.log('Follow: http://localhost:8080/orders');
  });
}

export default app;
