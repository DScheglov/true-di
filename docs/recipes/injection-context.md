---
description: How to compose containers
---

# Injection Context

The library keeps container to be idiomatic. That means container should not know
anything about how it is used and how some dependencies are injected.

All items in the container are singletons until they will be explicitly released.

However it is obvious that we cannot use only globally created containers
ignoring request-context on the server or rendering-context on the client.

So, there is a way how context could be considered with `true-di`:

- let's create a container as part of context (idealy the container should be a context).
- let's compose containers to create subcontext-related container based on the higher-context container.

## Example 1. Container Factory

Let's guess we need to log each request query and some of header, so we should provide
correspondent data to the constructor of `Logger`:

```typescript
import Express from "express";
import diContainer from 'true-di';
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';


const containerFactory = ({ query, headers }: Express.Request) => diContainer<IContainer>({
  logger: () =>
    new Logger(query, headers),

  dataSourceService: ({ logger }) => 
    new DataSourceService(logger),

  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),
});

export default containerFactory;
```

And then we should create a container when the context is defined:

```typescript
import express from 'express';
import containerFactory from './container';
import { getOrders } from './controller';

const app = express();

app.use((req, res, next) => {
  req.container = containerFactory(req);
  next();
});

app.get('/orders', getOrders);
app.listen(8080);
```

 ## Example 2. Combining global and request containers.

```typescript
import diContainer, { factoriesFrom } from 'true-di';
import Express from 'express';

type GlobalContainer = {
  logger: ILogger;
}

type RequestContainer = GlobalContainer & {
  dao: IDataAccessObject;
  ecommerceService: IECommerceService;
}

export const globalContainer = diContainer<GlobalContainer>({
  logger: () => new Logger(),
});

export const requestContainer = (req: Express.Request, globalContainer: GlobalContainer) =>
  diContainer<RequestContainer>({
    ...factoriesFrom(globalContainer),

    dao: ({ logger }) => new DataAccessObject(request.user, logger),
    ecommerceService: ({ dao }) => new ECommerceService(dao),
  });
```

In the example above the code:

```typescript
  ...factoriesFrom(globalContainer)
```

Do exactly the same as:

```typescript
  logger: () => globalContainer.logger,
```
 
However if `globalContainer` has a lot of items those should be inherited by the `requestContainer`
to write a lot of new factories could be very annoying.


## Example 3. Narrowing container

In the previous example we extend global container by adding two services on the request container. 

This example shows how to narrow container for some specific routes:

Define container factory function to create request level container:

```typescript
import Express from 'express';
import diContainer from 'true-di';
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';


const createContainer = ({ query, headers }: Express.Request) => 
  diContainer<IContainer>({
    logger: () =>
      new Logger(),

    dataSourceService: ({ logger }) => 
      new DataSourceService(logger),

    ecommerceService: ({ logger, dataSourceService }) =>
      new ECommerceService(logger, dataSourceService),
  });

export default createContainer;
```

Let's use our container in express:

```typescript
import express from 'express';
import diContainer, { factoriesFrom } from 'true-di';
import createContainer from './container';
import { getOrders } from './controller';

const app = express();

app.use((req, res, next) => {
  req.container = createContainer(req);
  next();
});

app.use('/orders', (req, res, next) => {
  const { container } = req;
  req.container = diContainer({
    logger: () => container.logger,
    ecommerceService: () => container.ecommerceService,
  });
  next();
});

app.get('/orders', getOrders);
app.listen(8080);
```

The code:

```typescript
app.use('/orders', (req, res, next) => {
  const { container } = req;
  req.container = diContainer({
    logger: () => container.logger,
    ecommerceService: () => container.ecommerceService,
  });
  next();
});
```

could be replaced with a litle bit more consice code:

```typescript
app.use('/orders', (req, res, next) => {
  req.container = diContainer(
    factoriesFrom(req.container, ['logger', 'ecommerceService'])
  );
  next();
});
```