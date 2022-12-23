import express from 'express';
import createContext from 'express-async-context';
import main from './main';
import { getFeaturedProducts } from './products-controller';

const app = express();

const Context = createContext(
  req => main.create({ token: req.headers.authorization ?? null }),
);

app.use(Context.provider);

app.get('/featured-products', Context.consumer(getFeaturedProducts));

if (module === require.main) {
  app.listen(8080, () => {
    console.log('Server is listening on port: 8080');
    console.log('Follow: http://localhost:8080/featured-products');

    console.log(`
    . .env && curl -H "authorization: \${USER_TOKEN}" http://localhost:8080/featured-products
    `);
  });
}

export default app;
