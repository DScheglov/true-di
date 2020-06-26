import pipe from '.';

describe('pipe', () => {
  it('returns value if no piping function is specified', () => {
    expect(pipe(1)).toBe(1);
  });

  it('returns result of application of single function', () => {
    expect(
      pipe(1, (x) => x + 2),
    ).toBe(3);
  });

  it('returns result of application of two functions', () => {
    expect(
      pipe(1, (x) => x + 5, (x) => x * 7),
    ).toBe(42);
  });
});
