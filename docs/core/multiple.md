---
description: decorates factories to allow multiple instantiation.
---

# multiple

## Import

```typescript
import { multiple } from 'true-di';
```

```javascript
const { multiple } = require('true-di');
```

## Declaration (3 overloadings)

```typescript
<IContainer, name extends keyof IContainer>(
  factory: IFactory<IContainer, name>
): IFactoryTuple<IContainer, name>
```

```typescript
<IContainer, name extends keyof IContainer>(
  [factory, initilizer]: IFactoryTuple<IContainer, name>,
): <IContainer, name> 
```

```typescript
<IContainer>(factories: IFactories<IContainer>): IFactories<IContainer>
```

## Arguments (1st overloading)

* **factory**: `IFactory<IContainer, Name>` - factory to be decorated to generate multiple instances.

## Arguments (2nd overloading)

* **factoryTuple**: `IFactoryTuple<IContainer, Name>` - factory tuple to be decorated to generate multiple instances.

## Returns

* `IFactoryTuple<IContainer, Name>` - factory tuple (factory and initializer) that allows to create multiple instances

## Arguments (3rd overloading)

* **factories**: `IFactories<IContainer>` - factories object to decorate all factories inside of it.

## Returns

* `IFactories<IContainer>` - factories object with decorated factories (or factory tuples)

## Example

```typescript
import diContainer, { multiple } from 'true-di';


type Node = {
  title: string,
}

type IContainer = {
  index: number,
  node: Node,
}

let counter = 0;

const container = diContainer<IContainer>({
  index: multiple(() => ++counter),
  node: multiple(({ index }) => ({ title: `Item #${index}` })),
});

const nodes = [
  container.node,
  container.node,
  container.node,
];
// nodes is an array:
// [
//   { title: 'Item #1' },
//   { title: 'Item #2' },
//   { title: 'Item #3' }
// ]
```

The same effect could be reached by decorating whole factories object

```typescript
const container = diContainer(multiple<IContainer>({
  index: () => ++counter,
  node: ({ index }) => ({ title: `Item #${index}` }),
}));
```