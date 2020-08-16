---
decription: code splitting is cool
---

# Creating Factories Object Separatelly from Container

If in some reason you need to define factories separatelly from the container
declaration, you can just declare factories object of type `IFactories<IContainer>`.


## Example 1. Declaring Factories Object

**./factories.ts**

```typescript
import { IFactories } from 'true-di';
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';


const factories: IFactories<IContainer> = {
  logger: () =>
    new Logger(),

  dataSourceService: ({ logger }) => 
    new DataSourceService(logger),

  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),
};

export default factories;
```

then we can use this factories object to create a container:

**./index.js**

```typescript
import express from 'express';
import diContainer from 'true-di';
import factories from './factories';
import { getOrders } from './controller';

const app = express();

app.use((req, res, next) => {
  req.container = diContainer(factories);
  next();
});

app.get('/orders', getOrders);
app.listen(8080);
```

## Example 2. Partial Factories Object

You can define several factories objects those could be marged on the container creation stage.

**./factories.ts**

```typescript
import { IFactories } from 'true-di';
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

type FactoryFor<Names extends keyof IContainer> = Pick<IFactories<IContainer>, Names>;

export const loggerFactory: FactoryFor<'logger'> = {
  logger: () => new Logger(),
};

export const dasFactory: FactoryFor<'dataSourceService'> = {
  dataSourceService: ({ logger }) => new DataSourceService(logger),
};

export const ecommerceServiceFactory: FactoryFor<'ecommerceService'> = {
  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),
};
```

and use these factories to create a container:

**./index.js**

```typescript
import express from 'express';
import diContainer from 'true-di';
import { loggerFactory, dasFactory, ecommerceServiceFactory } from './factories';
import { getOrders } from './controller';

const app = express();

app.use((req, res, next) => {
  req.container = diContainer({
    ...oggerFactory, 
    ...dasFactory, 
    ...ecommerceServiceFactory,
  });
  next();
});

app.get('/orders', getOrders);
app.listen(8080);
```

If some of partially declared factories contains a non-enumerable property, then use `shallowMerge`
function instead of spread-operator.

```typescript
import express from 'express';
import diContainer from 'true-di';
import { shallowMerge } from 'true-di/utils';
import { loggerFactory, dasFactory, ecommerceServiceFactory } from './factories';
import { getOrders } from './controller';

const app = express();

app.use((req, res, next) => {
  req.container = diContainer(shallowMerge(
    oggerFactory, 
    dasFactory, 
    ecommerceServiceFactory,
  ));
  next();
});

app.get('/orders', getOrders);
app.listen(8080);
```

## Example 3. Direct Factory Declaration

Sometimes it could be convenient to declare just a factory for an item.

```typescript
import { IFactory } from 'true-di';
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

type FactoryFor<Name extends keyof IContainer> = IFactory<IContainer, Name>;

export const logger: FactoryFor<'logger'> = () => new Logger();

export const dataSourceService: FactoryFor<'dataSourceService'> = 
  ({ logger }) => new DataSourceService(logger);

export const ecommerceService: FactoryFor<'ecommerceService'> =
  ({ logger, dataSourceService }) => new ECommerceService(logger, dataSourceService);
```

or

```typescript
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

export const logger = () => 
  new Logger();

export const dataSourceService = ({ logger }: IContainer) => 
  new DataSourceService(logger);

export const ecommerceService = ({ logger, dataSourceService }: IContainer) => 
  new ECommerceService(logger, dataSourceService);
```

or even

```typescript
import { ILogger, IDataSourceService } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

type DASDeps = {
  logger: ILogger;
}

type EComDeps = {
  logger: ILogger;
  dataSourceService: IDataSourceService;
}

export const logger = () => new Logger();

export const dataSourceService = ({ logger }: DASDeps) => 
  new DataSourceService(logger);

export const ecommerceService = ({ logger, dataSourceService }: EComDeps) => 
  new ECommerceService(logger, dataSourceService);
```

and then use these factories to create container:

```typescript
import express from 'express';
import diContainer from 'true-di';
import { logger, dataSourceService, ecommerceService } from './factories';
import { getOrders } from './controller';

const app = express();

app.use((req, res, next) => {
  req.container = diContainer({ logger, dataSourceService, ecommerceService });
  next();
});
```

**Caution**

Despite pointed bellow way to declare factory seems concise:

```typescript
export const logger = () => new Logger();
```

but the consumers of the container became to be dependent on the interface of specific 
logger implementation, that could be wider then `ILogger`.

So, it is better to declare such factories in this way:

```typescript
export const logger = (): ILogger => new Logger();
```