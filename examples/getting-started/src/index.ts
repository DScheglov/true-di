import express from 'express';
import container from './container';
import { getOrderById, getOrders } from './controller';
import { handleErrors } from './middlewares';

const app = express();

app.use((req, _, next) => {
  req.injected = container;
  next();
});

app.get('/orders', getOrders);
app.get('/orders/:id', getOrderById);

app.use(handleErrors);

if (module.parent == null) {
  app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
    console.log('Follow: http://localhost:8080/orders');
  });
}

export default app;
