import express from 'express';
import container from './container';
import { provideContext, fromContext } from './request-context';

const app = express();

app.use(
  provideContext(() => container(Date.now()))
);

app.get('/orders', fromContext('getOrders'));

if (module.parent == null) {
  app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
    console.log('Follow: http://localhost:8080/orders');
  });
}

export default app;
