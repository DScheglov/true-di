---
description: how to tackle a cyclic dependencies.
---

# Cyclic Dependencies

**Don't do cyclic dependencies.**

In some (rare) case you can need to use cyclic dependencies. The library allows you to specify both: factory- and init- function in factories object.

See example:

```typescript
import diContainer from 'true-di';

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
    (instance, { childItem }) => {
      instance.child = childItem
    },
  ],
  childItem: [
    () => createNode('Child' cxx),
    (instance { parentItem }) => {
      instance.parent = parentItem;
    },
  ],
});
```

Simillary to assigning instance property you can use `set*` method of the instance:

```typescript
const container = diContainer<Container>({
  parentItem: [
    () => createNode('Parent'),
    (instance, { childItem }) => instance.setChild(childItem),
  ],
  childItem: [
    () => createNode('Child' cxx),
    (instance { parentItem }) => instance.setParent(parentItem),
  ],
});
```

To write property-assignment code in more declarative way `true-di` ships: [`assignProps`](../utils/assign-props.md) utility function, and we can rewrite basic example with the one:

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

