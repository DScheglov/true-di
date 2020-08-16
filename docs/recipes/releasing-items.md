---
description: No memory leaks more.
---

# Releasing Items

To tackle possible memory leaks issues `true-di` allows to control what items are stored in the container. It doesn't allow to replace items, but it allows to unbind it from the container (release item).

To do that just assign the correspondent container property with `null` or `undefined` (don't try to delete it).

```typescript
container.logger = null;
```

It doesn't affect other already created items those are depent on it. They continue to use previously created item.

When you need to release all items from the container use [`releaseAll`](../core/release-all.md) function:

```typescript
releaseAll(container);
```

