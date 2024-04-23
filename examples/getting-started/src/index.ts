import express from 'express';
import main from './main';
import { scope } from '../../../src';
import { JSONMoneyReplacer } from './domain/money';

const app = express();

app.use((req, res, next) => {
  scope.async.run(next);
});

app.use((req, res, next) => {
  main.userService.setToken(req.headers.authorization ?? null);
  next();
});

app.get('/featured-products', main.productController.getFeaturedProducts);

app.get('/featured-products-2', async (req, res) => {
  const featuredProducts = await main.productService.getFeaturedProducts();

  res
    .status(200)
    .type('application/json')
    .send(JSON.stringify(featuredProducts, JSONMoneyReplacer, 2));
});

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
