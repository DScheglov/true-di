---
description: returns true if the item with `name` is already instantiated and stored in the `container`.
---

# isReady

## Import

```typescript
import { isReady } from 'true-di';
```

```javascript
const { isReady } = require('true-di');
```

## Declaration

```typescript
function isReady<IContainer>(container: IContainer, name: keyof IContainer): boolean
```

## Arguments

* **container**: `IContainer` - container to check if item created
* **name**: `keyof IContainer` - name of container items.

## Returns

* `boolean` - `true` if item is already created and `false` if it is not.

This function is needed because any attempt to read the item from the container causes the item will be created. `isReady` doesn't affect reading the component so it returns its status.

## Example

```typescript
import { isReady } from 'true-di/utils';
import container from './container';

console.log(isReady(container, 'logger'));
// prints: false -- if logger was not touched before

container.logger.info("Let's log a message");

console.log(isReady(container, 'logger'));
// prints: true

console.log(Boolean(container.logger));
// always prints true, becouse reading logger creates it
```

