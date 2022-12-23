import { describe, it, expect } from '@jest/globals';
import { matches } from './matches';

describe('matched', () => {
  it.each([
    [{ x: 1 }, { x: 1 }, true],
    [{ x: 1 }, { x: 2 }, false],
  ])('matched(%j)(%j) is %s', (pattern, item, expected) => {
    expect(matches(pattern)(item)).toBe(expected);
  });
});
