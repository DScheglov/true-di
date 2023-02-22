import { memoize } from './memoize';

describe('memoize', () => {
  const memo = memoize((value: number) => value);
  it('memoized function is called for the first time', () => {
    const f = jest.fn((a: number) => a * a);
    const memoized = memo(f);

    expect(memoized(2)).toBe(4);
    expect(f).toBeCalledTimes(1);
    expect(f).toBeCalledWith(2);
  });

  it('memoized function is not called for the secont time with the same value', () => {
    const f = jest.fn((a: number) => a * a);
    const memoized = memo(f);

    expect(memoized(2)).toBe(4);
    expect(memoized(2)).toBe(4);

    expect(f).toBeCalledTimes(1);
    expect(f).toBeCalledWith(2);
  });

  it('memoized function is called for new value', () => {
    const f = jest.fn((a: number) => a * a);
    const memoized = memo(f);

    expect(memoized(2)).toBe(4);
    expect(memoized(2)).toBe(4);
    expect(memoized(3)).toBe(9);

    expect(f).toBeCalledTimes(2);
    expect(f).toHaveBeenNthCalledWith(1, 2);
    expect(f).toHaveBeenNthCalledWith(2, 3);
  });
});
