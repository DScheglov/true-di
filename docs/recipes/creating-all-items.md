---
description: Not too long read about how create all items.
---

# Creating All Itens

As usually you don't need to create all items at once, but it is quit convinient way to check if all items could be created and container doesn't have cyclic creation dependencies.

```typescript
describe('myContainer', () => {
  it('creates all items', () => {
    expect({ ...container }).toEqual(container);
  });
});
```

As you can see all items could be instantiated by using spread or rest operators:

```typescript
const items = { ...container }; // using spread operator
// or
const { ...items } = container; // using rest and destructuring
```

However such aproach doesn't work if container has some non-enumerable fields:

```typescript
type Container = {
  x: number,
  y: number,
  z: number,
};

const container = diContainer<Container>(Object.create(null, {
  x: { value: () => 1, enumerable: true },
  y: { value: () => 2, enumerable: true },
  z: { value: () => 3, enumerable: false },
}));

const items = { ...container };

console.log({ z: items.z });
// prints: { z: undefined }

console.log({
    isXReady: isReady(container, 'x'),
    isYReady: isReady(container, 'y'),
    isZReady: isReady(container, 'z'),
});

// prints: { isXReady: true, isYReady: true, isZReady: false }
```

To create all items including bound to non-enumerable fields use [`prepareAll`](../core/prepare-all.md) function:

```typescript
const container = diContainer<Container>(Object.create(null, {
  x: { value: () => 1, enumerable: true },
  y: { value: () => 2, enumerable: true },
  z: { value: () => 3, enumerable: false },
}));

const items = prepareAll(container);

console.log({ z: items.z });
// prints: { z: 3 }

console.log({
    isXReady: isReady(container, 'x'),
    isYReady: isReady(container, 'y'),
    isZReady: isReady(container, 'z'),
});

// prints: { isXReady: true, isYReady: true, isZReady: true }
```

It is suggested to use [`prepareAll`](../core/prepare-all.md) function raither then spread/rest operators because:

1. it is more explicitly creates all items (explicit is better then implicit)
1. it is most reliable way to create all items

