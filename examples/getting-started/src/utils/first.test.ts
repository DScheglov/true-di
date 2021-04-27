import { first } from './first';

describe('first', () => {
  it.each([
    ['', ''],
    [[''], ''],
    [[], undefined],
    [['a', 'b'], 'a'],
    [null, null],
    [undefined, undefined],
    [[[1], [2]], [1]],
  ])('first(%j) = %j', (value, expected) => {
    expect(first(value as any)).toEqual(expected);
  });
});
