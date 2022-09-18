import { hasOwn } from './has-own';

describe('hasOwn', () => {
  it.each([
    [{ f: 1 }, 'f'],
    [Object.defineProperty(Object.create(null), 'f', { value: 1 }), 'f'],
  ])('it returns true for (%j, %j)', (obj, name) => {
    expect(hasOwn(obj, name)).toBe(true);
  });

  it.each([
    [{ f: 1 }, 'n'],
    [Object.defineProperty(Object.create(null), 'n', { value: 1 }), 'f'],
  ])('it returns false for (%j, %j)', (obj, name) => {
    expect(hasOwn(obj, name)).toBe(false);
  });
});
