import Module, { asUseCases, scope } from '../../../src';
import { DiscountService } from './DiscountService';
import { Product } from './domain/products';
import { ProductRepoMock } from './ProductRepoMock';
import { ProductService } from './ProductService';
import { UserService } from './UserService';
import PRODUCTS_JSON from './products.json';
import * as productController from './ProductController';

const main = Module()
  .private({
    productRepo: () =>
      new ProductRepoMock(PRODUCTS_JSON as Product[]),
  })
  .public(scope.async, {
    userService: () =>
      new UserService(),
  })
  .private({
    discountService: ({ userService }) =>
      new DiscountService(userService),
  })
  .public({
    productService: ({ productRepo, discountService }) =>
      new ProductService(productRepo, discountService),
  })
  .public({
    productController: asUseCases(productController),
  })
  .create();

export default main;
