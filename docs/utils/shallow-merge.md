---
description: creates new object and copies to the one property descriptors of all source objects. In case of name-conflict last source wins.
---

# shallowMerge

## Import

```typescript
import { shallowMerge } from 'true-di/utils';
```

```javascript
const { shallowMerge } = require('true-di/utils');
```


## Declaration

```typescript
function shallowMerge(...sourceObject: object[]): object
```

Actually `shallowMerge` is well-typed up to 15 source objects. See [code source](../../src/utils/shallow-merge.ts).

## Arguments

 * **sourceObjects**: `object[]` - objects to be merged in new objects.

## Returns

 * **new object**

### Types

```typescript
export type Merge<T1 extends object, T2 extends object> =
  Omit<T1, keyof T2> & T2; // Overriding Join
```

## Example

```typescript
import diContainer, { factoriesFrom } from 'true-di';

type IContainer1 = {
  service11: IService11,
  service12: IService12,
}

type IContainer2 = {
  service11: IService11,
  service12: IService12,
}

const container1 = diContainer<IContainer1>(Object.create(null, {
  service11: { enumerable: false, value: () => createService11() },
  service12: { enumerable: false, value: () => createService12() },
}));

const container2 = diContainer<IContainer1>(Object.create(null, {
  service21: { enumerable: false, value: () => createService21() },
  service22: { enumerable: false, value: () => createService22() },
}));

export default diContainer<IContainer1 & IContainer2>(shallowMerge(
  factoriesFrom(container1),
  factoriesFrom(container2),
));
```
