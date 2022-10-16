export type ETuple<E, T> = [E, null] | [null, T];
type GetKeyFn<T, K> = (item: T) => K;

export type IUniqueStack<T> = {
  push:(value: T) => ETuple<Error, T>,
  pop: (expected?: T) => ETuple<Error, T>,
  prev: () => T | null;
  readonly items: T[],
  readonly size: number,
};

const _push =
  <T, K>(stack: T[], set: Set<K>, getKey: GetKeyFn<T, K>) =>
    (item: T): ETuple<Error, T> => {
      const key = getKey(item);
      if (set.has(key)) return [new Error('Duplicated item has been pushed to the stack.'), null];
      stack.unshift(item);
      set.add(key);
      return [null, item];
    };

const _pop =
  <T, K>(stack: T[], set: Set<K>, getKey: GetKeyFn<T, K>) =>
    (expected?: K): ETuple<Error, T> => {
      if (stack.length === 0) {
        return [new Error('Trying to extract item from the empty stack'), null];
      }

      const last = stack.shift()!;
      const key = getKey(last);
      set.delete(key);

      return (
        expected === undefined || key === expected
          ? [null, last]
          : [new Error('Extracted item is not equal to expected one'), null]
      );
    };

const _prev = <T>(stack: T[]) => () => (stack.length > 1 ? stack[1] : null);

const UniqueStackApi =
  <T, K>(stack: T[], set: Set<any>, getKey: GetKeyFn<T, K>): IUniqueStack<T> => ({
    push: _push(stack, set, getKey),
    pop: _pop(stack, set, getKey),
    prev: _prev(stack),
    get size(): number {
      return stack.length;
    },
    get items(): T[] {
      return stack.slice();
    },
  });

const idX = <T>(item: T) => item;

const UniqueStack = <T, K = T>(getKey: GetKeyFn<T, K> = idX as any) =>
  UniqueStackApi<T, K>([], new Set(), getKey);

export default UniqueStack;
