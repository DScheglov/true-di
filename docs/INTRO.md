---
description: Framework Agnostic, Zero Dependency, Isomorphic & Minimalistic Dependency Injection Container for TypeScript and JavaScript projects
---

# TRUE-DI

## Motivation

`true-di` is designed to be used with [Apollo Server](https://github.com/apollographql/apollo-server) considering to make resolvers as thin as possible, to keep all business logic testable and framework agnostic by strictly following **S**.**O**.**L**.**I**.**D** Principles.

Despite the origin motivation being related to Apollo Server the library could be used with any other framework or library that supports injection through the context.

The [Getting Started Example](https://github.com/DScheglov/true-di/tree/master/examples/getting-started) shows how to use `true-di` with one of the most popular nodejs libraries: [Express](https://expressjs.com/). Almost all code in the example (~95%) is covered with tests that prove your business logic could be easily decoupled and kept independent even from dependency injection mechanism.

Thanking to business logic does not depend on specific injection mechanism you can defer the
choice of framework. Such deferring is suggested by Robert Martin:

> The purpose of a good architecture is to defer decisions, delay decisions. The job of an architect is not to make decisions, the job of an architect is to build a structure that allows decisions to be delayed as long as possible.

[&copy; 2014, Robert C. Martin: Clean Architecture and Design, NDC Conference](https://vimeo.com/68215570),

Summarizing, `true-di` is based on:
 - emulattion of a plain object that allows to specify exact type for each item and makes strict static type checking possible
 - explicit dependency injection for business logic (see example: [./src/container.ts](https://github.com/DScheglov/true-di/tree/master/examples/getting-started/src/container.ts))
 - transperent injection through the context for framework-integrated components (see example: [./src/index.ts](https://github.com/DScheglov/true-di/tree/master/examples/getting-started/src/index.ts))

## Some useful facts about `true-di`?

1. No syntatic decorators (annotations) as well as `reflect-metadata` are needed
1. `diContainer` uses `getters` under the hood. Container doesn't create an item until your code requests
1. Constructor-injection of cyclic dependency raises an exception
1. The property-, setter- dependency injects is also supported (what allows to resolve cyclic dependencies)
1. `diContainer`-s could be composed
1. Symbolic names are also supported for items

## Installation

```bash
npm i --save true-di
```

```bash
yarn add true-di
```

## Usage Example:

- [Live Demo on Sandbox](https://codesandbox.io/s/github/DScheglov/true-di/tree/master/examples/getting-started?fontsize=14&hidenavigation=1&initialpath=%2Forders&module=%2Fsrc%2Fcontainer.ts&theme=dark)
- [Example Source Code](https://github.com/DScheglov/true-di/tree/master/examples/getting-started)


{% tabs %}
{% tab title="./src/container.ts" %}

```typescript
import diContainer from 'true-di';
import { ILogger, IDataSourceService, IECommerceService } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

type IServices = {
  logger: ILogger,
  dataSourceService: IDataSourceService,
  ecommerceService: IECommerceService,
}

export default diContainer<IServices>({
  logger: () =>
    new Logger(),

  dataSourceService: ({ logger }) =>
    new DataSourceService(logger),

  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),
});
```
{% endtab %}
{% tab title="./src/ECommerceService/index.ts" %}

```typescript
import {
  IECommerceService, IDataSourceService, Order, IInfoLogger
} from '../interfaces';

class ECommerceSerive implements IECommerceService {
  constructor(
    private readonly _logger: IInfoLogger,
    private readonly _dataSourceService: IDataSourceService,
  ) {
    _logger.info('ECommerceService has been created');
  }

  async getOrders(): Promise<Order[]> {
    const { _logger, _dataSourceService } = this;
    // do something
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { _logger, _dataSourceService } = this;
    // do something
  }
}

export default ECommerceSerive;
```

{% endtab %}
{% tab title="./src/controller.ts" %}

```typescript
import Express from 'express';
import { IGetOrderById, IGetOrders } from './interfaces';
import { Injected } from './interfaces/IRequestInjected';
import { sendJson } from './utils/sendJson';
import { expectFound } from './utils/NotFoundError';

export const getOrders = (
  { injected: { ecommerceService } }: Injected<{ ecommerceService: IGetOrders }>,
  res: Express.Response,
  next: Express.NextFunction,
) =>
  ecommerceService
    .getOrders()
    .then(sendJson(res), next);

export const getOrderById = (
  { params, injected: { ecommerceService } }:
    { params: { id: string } } & Injected<{ ecommerceService: IGetOrderById }>,
  res: Express.Response,
  next: Express.NextFunction,
) =>
  ecommerceService
    .getOrderById(params.id)
    .then(expectFound(`Order(${params.id})`))
    .then(sendJson(res), next);
```

{% endtab %}
{% tab title="./src/index.ts" %}

```typescript
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
```
{% endtab %}
{% endtabs %}


