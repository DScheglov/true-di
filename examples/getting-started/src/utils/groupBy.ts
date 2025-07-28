type KeyResolver<R, K> = (record: R) => K;
type Reducer<R, T> = (groupTotal: T | undefined, record: R, index: number, list: R[]) => T;

export const groupBy = <K, R, T>(getKey: KeyResolver<R, K>, reducer: Reducer<R, T>) =>
  (records: R[]): T[] => Array.from(records.reduce(
    (groups, record: R, index, list) => {
      const key = getKey(record);
      return groups.set(key, reducer(groups.get(key), record, index, list));
    },
    new Map(),
  ).values());
