export type ETuple<E, T> = [E, null] | [null, T];

export type IUniqueStack<T> = {
  push:(value: T) => ETuple<Error, T>,
  pop: (expected?: T) => ETuple<Error, T>,
  readonly items: T[],
  readonly size: number,
};

const _push = <T>(stack: T[], set: Set<T>) => (item: T): ETuple<Error, T> => {
  if (set.has(item)) return [new Error('Duplicated item has been pushed to the stack.'), null];
  stack.unshift(item);
  set.add(item);
  return [null, item];
};

const _pop = <T>(stack: T[], set: Set<T>) => (expected?: T): ETuple<Error, T> => {
  if (stack.length === 0) {
    return [new Error('Trying to extract item from the empty stack'), null];
  }

  const last = stack.shift()!;
  set.delete(last);

  return (
    expected === undefined || last === expected
      ? [null, last]
      : [new Error('Extracted item is not equal to expected one'), null]
  );
};

const UniqueStackApi = <T>(stack: T[], set: Set<T>): IUniqueStack<T> => ({
  push: _push(stack, set),
  pop: _pop(stack, set),
  get size(): number {
    return stack.length;
  },
  get items(): T[] {
    return stack.slice();
  },
});

const UniqueStack = <T>() => UniqueStackApi<T>([], new Set());

export default UniqueStack;
