import express from 'express';
import container from './container';
import { getOrders } from './controller';

const app = express();

app.use((req, _, next) => {
  req.container = container;
  next();
});

app.get('/orders', getOrders);

if (module.parent == null) {
  app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
    console.log('Follow: http://localhost:8080/orders');
  });
}

export default app;
