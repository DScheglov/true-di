import { groupBy } from './groupBy';

describe('groupBy', () => {
  it('creates grouping function', () => {
    expect(
      groupBy(
        (x: number) => x,
        (list: number[] | undefined, item: number) => {
          list ??= [];
          list.push(item);
          return list;
        },
      ),
    ).toBeInstanceOf(Function);
  });

  describe('grouping', () => {
    it('returns empty list for empty list', () => {
      const groupByValue = groupBy(
        (x: number) => x,
        (list: number[] | undefined, item: number) => {
          list ??= [];
          list.push(item);
          return list;
        },
      );

      expect(groupByValue([])).toEqual([]);
    });

    it('counts number of same items', () => {
      const groupByValue = groupBy(
        (x: number) => x,
        (count: number = 0) => count + 1,
      );

      expect(groupByValue([1, 2, 3, 4])).toEqual([1, 1, 1, 1]);
      expect(groupByValue([1, 2, 1, 4])).toEqual([2, 1, 1]);
    });

    it('groups same items', () => {
      const groupByValue = groupBy(
        (x: number) => x,
        (list: number[] | undefined, item) => {
          list ??= [];
          list.push(item);
          return list;
        },
      );

      expect(groupByValue([1, 2, 3, 4])).toEqual([[1], [2], [3], [4]]);
      expect(groupByValue([1, 2, 1, 4])).toEqual([[1, 1], [2], [4]]);
    });
  });
});
