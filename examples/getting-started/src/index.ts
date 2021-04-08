import express from 'express';
import createContext from 'express-async-context';
import container from './container';
import { getOrderById, getOrders } from './controller';
import { handleErrors } from './middlewares';

const app = express();
const Context = createContext(() => container);

app.use(Context.provider);

app.get('/orders', Context.consumer(getOrders));
app.get('/orders/:id', Context.consumer(getOrderById));

app.use(Context.consumer(handleErrors));

if (module === require.main) {
  app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
    console.log('Follow: http://localhost:8080/orders');
  });
}

export default app;
