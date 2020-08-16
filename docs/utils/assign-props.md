---
description: Creates item initializer using passed fields map. `assignProps` builds function that maps some container fields to item fields.
---

# assignProps

## Import

```typescript
import { assignProps } from 'true-di/utils';
```

```javascript
const { assignProps } = require('true-di/utils');
```

## Declaration

```typescript
function assignProps<IContainer, Name extends keyof IContainer>(
  mapping: IMapping<IContainer, IContainer[Name]>,
): (item: IContainer[Name], container: IContainer) => void
```

## Arguments

* **mapping**: `IMapping<IContainer, IContainer[Name]>` -- plan JavaScript object which keys are fields of the item
and values are the string names of container items.

### Types

```typescript
type KeysOfType<T, F> = {
  [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { [Q in P]: F }, P>
}[keyof T];

export type IMapping<IContainer extends object, T> = {
  [p in keyof T]?: KeysOfType<IContainer, T[p]>
}
```

## Returns

* **initializer**: `IInstanceInitializer<IContainer, Name>`

## Example:

```typescript
import diContainer from 'true-di';
import { assignProps } from 'true-di/utils';

type Node = {
  child: Node;
  parent: Node;
  name: string;
}

type Container = {
  parentItem: Node;
  childItem: Node;
}

const createNodeFactory = (name: string): Node => () => ({ 
  child: null, parent: null, name
});

const container = diContainer<Container>({
  parentItem: [
    createNodeFactory('Parent'),
    assignProps({ child: 'childItem' }),
  ],
  childItem: [
    createNodeFactory('Child'),
    assignProps({ parent: 'parentItem' }),
  ],
});
```