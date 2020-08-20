import express from 'express';
import container from './container';
import { getOrders } from './controller';
import expressDi from './express-di';

const app = express();

const { addInjectionContext, injectTo } = expressDi(() => container);

app.use(addInjectionContext);

app.get('/orders', injectTo(getOrders));

if (module.parent == null) {
  app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
    console.log('Follow: http://localhost:8080/orders');
  });
}

export default app;
