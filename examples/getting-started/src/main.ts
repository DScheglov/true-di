import Module from '../../../src';
import { DiscountService } from './DiscountService';
import { Product } from './domain/products';
import { ProductRepo } from './ProductRepo';
import { ProductService } from './ProductService';
import { UserService } from './UserService';
import PRODUCTS_JSON from './products.json';

const main = Module()
  .private({
    productRepo: () => new ProductRepo(PRODUCTS_JSON as Product[]),
  })
  .public({
    userService: (_, { token }: { token: string | null }) =>
      new UserService(token),
  })
  .private({
    discountService: ({ userService }) =>
      new DiscountService(userService),
  })
  .public({
    productService: ({ productRepo, discountService }) =>
      new ProductService(productRepo, discountService),
  });

export default main;
