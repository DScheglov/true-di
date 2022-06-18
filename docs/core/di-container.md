---
description: creates and returns an empty IOC-Container. The first item will be created and stored only after it is requested.
---

# diContainer

## Import

```typescript
import diContainer from 'true-di';
```

```javascript
const { default: diContainer } = require('true-di');
```

## Declaration

```typescript
function diContainer<IContainer extends object>(factories: IFactories<IContainer>): IContainer
function diContainer<Private extends object, Public extends object>(
  privateFactories: Pick<IFactories<Private & Public>, keyof Private>,
  publicFactories: Pick<IFactories<Private & Public>, keyof Public>,
): Public
```

## Arguments (1st overload)

* **factories**: `IFactories<IContainer>` -- plain JavaScript object that is used as a map, where field names are item names and values are factory-functions that create correspondent items. To support property/setter injections the values of the factories-object could be a tuple (array), the first item of such tuple is a factory function and the second is an instance initializer.

## Returns (1st overload)

* **container**: `IContainer`

## Arguments (2nd overload)

* **privateFactories**: `Pick<IFactories<Private & Public>, keyof Private>` - the factories of the private services
* **publicFactories**: `Pick<IFactories<Private & Public>, keyof Public>` - the factories of the public services

## Returns (2st overload)

* **container**: `Public` - container resolving public services only

## Factory Types

### Type `IFactories<IContainer>`

Type declaration:

```typescript
type IFactories<IContainer extends object> = {
  [name in keyof IContainer]:
    IFactory<IContainer, name> | IFactoryTuple<IContainer, name>
}
```

### Type `IFactory<IContainer, name>`

Type declaration:

```typescript
type IFactory <IContainer, name extends keyof IContainer> =
  (container: IContainer) => IContainer[name]
```

### Type `IFactoryTuple<IContainer, name>`

Type declaration:

```typescript
type IFactoryTuple<IContainer, name extends keyof IContainer> =
  [IFactory<IContainer, name>, IInstanceInitializer<IContainer, name>];
```

### Type `IInstanceInitializer<IContainer, name>`

Type declaraion:

```typescript
type IInstanceInitializer<IContainer, name extends keyof IContainer> =
  (instance: IContainer[name], container: IContainer) => void;
```

The container doesn't have any methods but only properties copied from the factories. You can get all property descriptors using standard JS-API.

## Example "Getting Started"

```typescript
import diContainer from 'true-di';
import { IContainer } from './interfaces';
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';


const container = diContainer<IContainer>({
  logger: () =>
    new Logger(),

  dataSourceService: ({ logger }) => 
    new DataSourceService(logger),

  ecommerceService: ({ logger, dataSourceService }) =>
    new ECommerceService(logger, dataSourceService),
});

export default container;
```

## Example "Exposing only ECommerceService"

```typescript
import diContainer from 'true-di';
import { IInfoLogger, IDataSourceService } from "./interfaces";
import Logger from './Logger';
import DataSourceService from './DataSourceService';
import ECommerceService from './ECommerceService';

const createLogger = () =>
  new Logger();

const createDataSourceService = ({ logger }: {
  logger: IInfoLogger
}) => new DataSourceService(logger);

const createECommerceService = ({ logger, dataSourceService }: {
  logger: IInfoLogger,
  dataSourceService: IDataSourceService,
}) => new ECommerceService(logger, dataSourceService);

const { ecommerceService } = diContainer({
  logger: createLogger,
  dataSourceService: createDataSourceService,
}, {
  ecommerceService: createECommerceService,
});

await ecommerceService.getOrders();
```

## Example "Working With Cyclic Dependencies"

```typescript
type Node = {
  child: Node;
  parent: Node;
  name: string;
}

type Container = {
  parentItem: Node;
  childItem: Node;
}

const createNode = (name: string): Node => ({ child: null, parent: null, name });

const container = diContainer<Container>({
  parentItem: [
    () => createNode('Parent'),
    (parentItem, { childItem }) => {
      parentItem.child = childItem
    },
  ],
  childItem: [
    () => createNode('Child' cxx),
    (childItem, { parentItem }) => {
      childItem.parent = parentItem;
    },
  ],
});
```

