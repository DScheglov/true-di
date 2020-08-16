import express from 'express';
import container from './container';
import { getOrders } from './controller';

const app = express();

app.use((req, res, next) => {
  req.container = container;
  next();
});

app.get('/orders', getOrders);
app.listen(8080);
