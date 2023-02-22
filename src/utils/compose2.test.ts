import { compose2 } from './compose2';

describe('compose2', () => {
  it('composes 2 functions', () => {
    const f = jest.fn((x: number) => x + 1);
    const g = jest.fn((x: number) => x * 2);
    const h = compose2(f, g);

    expect(h(2)).toBe(5);
    expect(g).toHaveBeenCalledTimes(1);
    expect(f).toHaveBeenCalledTimes(1);
    expect(g).toHaveBeenCalledWith(2);
    expect(f).toHaveBeenCalledWith(4);
  });
});
