# true-di

Zero Dependency, Minimalistic **Type-Safe DI Container** for TypeScript and JavaScript projects

[![Build Status](https://travis-ci.org/DScheglov/true-di.svg?branch=master)](https://travis-ci.org/DScheglov/true-di) [![Coverage Status](https://coveralls.io/repos/github/DScheglov/true-di/badge.svg?branch=master)](https://coveralls.io/github/DScheglov/true-di?branch=master) [![npm version](https://img.shields.io/npm/v/true-di.svg?style=flat-square)](https://www.npmjs.com/package/true-di) [![npm downloads](https://img.shields.io/npm/dm/true-di.svg?style=flat-square)](https://www.npmjs.com/package/true-di) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/DScheglov/true-di/blob/master/LICENSE)

## Installation

```bash
npm i --save true-di
```

```bash
yarn add true-di
```

## Usage Example

The following code is an example solution that is based on the example used in the book ["Dependency Injection Principles, Practices, and Patterns"](https://www.manning.com/books/dependency-injection-principles-practices-patterns) by Steven van Deursen and Mark Seemann.

The problem is to display the list of featured products and discount their prices for the preferred customers.

More details on the example could be found in the "Getting Started" Example Project
[README](./examples/getting-started/README.md) file.

### ./src/main.ts - composition root

```typescript
import Module, { asUseCases, scope } from 'true-di';
import { DiscountService } from './DiscountService';
import { Product } from './domain/products';
import { ProductRepoMock } from './ProductRepoMock';
import { ProductService } from './ProductService';
import { UserService } from './UserService';
import * as productController from './ProductController';
import PRODUCTS_JSON from './products.json';

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

```

### ./src/DiscountService/index.ts

```typescript
import { IDiscountService, IUserProvider } from '../interfaces';

export const PREFERRED_CUSTOMER_DISCOUNT: number = 0.05;
export const NO_DISCOUNT: number = 0;

export class DiscountService implements IDiscountService {
  constructor(
    private readonly userService: IUserProvider,
  ) {}

  async getDiscountRate() {
    const user = await this.userService.getCurrentUser();
    return user != null && user.isPreferredCustomer
      ? PREFERRED_CUSTOMER_DISCOUNT
      : NO_DISCOUNT;
  }
}
```

### ./src/ProductRepoMock/index.ts

```typescript
import { Product } from '../domain/products';
import { IProductRepo } from '../interfaces';
import { matches } from '../utils/matches';

export class ProductRepoMock implements IProductRepo {
  constructor(private readonly products: Product[]) {}

  async getProducts(match?: Partial<Product>): Promise<Product[]> {
    return match != null ? this.products.filter(matches(match)) : this.products.slice();
  }
}
```

### ./src/UserService/index.ts

```typescript
import { parseToken } from '../domain/user-token';
import { User } from '../domain/users';
import { IUserService } from '../interfaces';

export class UserService implements IUserService {
  #user: User | null = null;

  #token: string | null = null;

  constructor(readonly token: string | null) {
    this.#token = token;
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.#user == null && this.#token != null) {
      this.#user = parseToken(this.#token);
    }

    return this.#user;
  }
}
```

### ./src/ProductService/index.ts

```typescript
import { applyDiscount } from '../domain/products';
import {
  IDiscountRateProvider,
  IProductService,
  IProductsProvider,
} from '../interfaces';

export class ProductService implements IProductService {
  constructor(
    private readonly products: IProductsProvider,
    private readonly discountService: IDiscountRateProvider,
  ) {}

  async getFeaturedProducts() {
    const discountRate = await this.discountService.getDiscountRate();
    const featuredProducts = await this.products.getProducts({ isFeatured: true });

    return discountRate > 0
      ? featuredProducts.map(applyDiscount(discountRate))
      : featuredProducts;
  }
}
```

### ./src/ProductController/index.ts

```typescript
import type { Request, Response } from 'express';
import { JSONMoneyReplacer } from './domain/money';
import { IFeaturedProductProvider } from './interfaces/IProductService';

type GetFeaturedProductsDeps = {
  productService: IFeaturedProductProvider;
}

export const getFeaturedProducts =
  (req: Request, res: Response) =>
    async ({ productService }: GetFeaturedProductsDeps) => {
      const featuredProducts = await productService.getFeaturedProducts();

      res
        .status(200)
        .type('application/json')
        .send(JSON.stringify(featuredProducts, JSONMoneyReplacer, 2));
    };

```

### ./src/index.ts

```typescript
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
```

## Some Concepts

### Module

In the context of `true-di`, a **Module** is a collection of named and typed
items that can communicate with each other. These items can be either
**private**,meaning they are only accessible within the **Module**, or
**public**, which allows them to be accessed both inside and outside of the
**Module**.

Essentially, a **Module** can be thought of as an instance of a class, with
private and public fields. However, in `true-di`, none of the items within the
**Module** are created until they are requested from outside of the module,
including the function provided to the `.expose` method of the **ModuleBuilder**.

The **Module** could be created by invoking the **Module Factory** function.

### Module Factory

The **Module Factory** is a function that takes an object called **external dependencies**
as input and uses it to create a **Module**. Later on, when an item within the
**Module** is requested, the corresponding **Resolver** will receive the
**external dependencies** as input to resolve the item.

In `true-di`, the **Module Factory** is essentially a composition of Resolvers
that have been defined for each item within the module. This means that the code
defining the Module Factory serves as the Composition Root, where all loosely
coupled components such as classes and functions are brought together and
assembled in a cohesive manner.

### Resolver & Resolution Rule

The **Resolver** is an item factory, that receives two parameters:

- **internal dependencies** - an object containing all Module items (excluding
the creating one)
- **external dependencies** - an object passed to the **Module Factory**

**Resolver** is an implementation of the **Resolution Rule**, the rule defines how
to create a specific item using other items of **Module** and **external dependencies**.

Unlike some other dependency injection solutions, `true-di` does not rely on interfaces
or type names to define how to create an item. Instead, it uses explicit item
names and **Resolvers** defined for each name. This approach avoids the need for
additional abstractions in cases where a single interface is implemented by
several different components (classes).

Also it allows to use `true-di` with JS-projects those don't have any interfaces
or type names nor in build time, nor in runtime.

### Initializers

**Initializer** - is a function associated with a some item of **Module** that receives
two arguments:

- the **item** to be initialized
- the **internal dependencies** object with all items of the **Module**

And initializes the **item**.

The **Initializer** is an implement of the "Injection via property" pattern
that is useful to resolve cyclic dependencies.

> **Note**: The Cyclic Dependencies is an anti-pattern and should be avoided whenever
> it is possible.

The **Initializers** is an object that maps item names to correspondent item **Initializer**

### Module Builder

### Module Use Cases

### Life Time Scope

## API Reference
