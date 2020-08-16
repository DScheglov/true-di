---
description: About quantum nature of container items.
---

# Accessing Items

To access items is the most spreaded use-case for the di-container.

```typescript
const item = container.item;

// or

const { item } = container;

// or

const item = container[item];

// or even

const itemName = 'item';
const item = container[itemName];
```

All of that works.

Container doesn't create any of its items when it is been created. Each time when your code accesses the item, container checks if item is created and if it is returns it, otherwise container calls correspondent factory function and passes itself to the factory.

When the factory function accesses some other items those are need to build the target one container creates them \(if they are not ready\) and returns them to the factory functions.

This is the main dependency resolution mechanizm that is exactly the same as just accessing the items.

