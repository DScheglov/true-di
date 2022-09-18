import http from 'http';
import match, { firstOf } from './utils/exec';
import httpListener from './utils/httpListener';

import createContainer from './container';
import { getOrderById, getOrders } from './controller';
import { handleErrors } from './middlewares';

const handler = firstOf(
  match('/orders', getOrders),
  match('/orders/:id', getOrderById),
);

http.createServer(
  httpListener(
    createContainer, // create request context
    handler,
    handleErrors,
  ),
).listen(8080, () => console.log('Server is ready: http://localhost:8080'));
