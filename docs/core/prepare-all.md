---
description: Creates all items in the container.
---

# prepareAll

## Import

```typescript
import { prepareAll } from 'true-di';
```

```javascript
const { isReady } = require('true-di');
```

## Typing:

```typescript
function prepareAll<IContainer>(container: IContainer): IContainer
```

## Arguments:

* **container**: `IContainer` - container to create all its items.

## Returns:

* **static copy of the container**: `IContainer` - plain JS-object with fields those are container items.

## Example:

```typescript
import { isReady, prepareAll } from 'true-di/utils';
import container from './container';

prepareAll(container);

console.log(
  isReady(container, 'logger'), 
  isReady(container, 'dataAccessService'), 
  isReady(container, 'ecommerceService')
);
// prints: true true true
```

