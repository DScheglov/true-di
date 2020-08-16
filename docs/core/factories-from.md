---
description: Creates factories object based on the passed container.
---

# factoriesFrom

## Import

```typescript
import { factoriesFrom } from 'true-di';
```

```javascript
const { factoriesFrom } = require('true-di');
```

## Declaration

```typescript
<IContainer extends object, Name extends keyof IContainer = keyof IContainer>(container: IContainer, names?: Name[]): IPureFactories<Pick<IContainer, Name>>
```

## Arguments

 - **container**: `IContainer` - container to be used as a source of instancies for new factories.
 - **names**: `Name[]` - _optional_ - the list of item names to be factoried with the new factories object. If omitted all items from the container are considered to be factored with new factories object.

## Returns
 
 - **factories**: `IPureFactories<IContainer>` factories object.

 ### Types:

```typescript
export type IPureFactories<IContainer> = {
  [name in keyof IContainer]: () => IContainer[name]
}
```

 The main goal of the `factoriesFrom` function was added to the `true-di` core is
 to get some way to compose two (or more) containers.

 ## Example 1. Combining global and request containers.

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

## Example 2. Narrowing container

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