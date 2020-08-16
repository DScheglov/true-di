
export const groupBy = <K, R, T>(
  getKey: (record: R) => K,
  reducer: (groupTotal: T, record: R, index: number, list: R[]) => T
) => (records: R[]): Map<K, T> => records.reduce(
  (groups, record: R, index, list) => {
    const key = getKey(record);
    groups.set(key, reducer(groups.get(key), record, index, list));
    return groups;
  },
  new Map()
);
