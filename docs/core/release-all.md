---
description: Releases (unbinds) all items from the container.
---

# releaseAll

## Import

```typescript
import { releaseAll } from 'true-di';
```

```javascript
const { releaseAll } = require('true-di');
```

## Typing

```typescript
function releaseAll<IContainer extends object>(container: IContainer): void
```

## Arguments:

* **container**: `IContainer` - container to unbind items from

## Returns:

* _nothing_

## Example:

```typescript
import { isReady, releaseAll } from 'true-di/utils';
import container from './container';

releaseAll(container);

console.log(
  isReady(container, 'logger'), 
  isReady(container, 'dataAccessService'), 
  isReady(container, 'ecommerceService')
);
// prints: false false false
```

