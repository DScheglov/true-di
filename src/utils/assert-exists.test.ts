import assertExists from './assert-exists';

describe('assertExists', () => {
  it('returns object if it is not null and not undefined', () => {
    const $s = Symbol('an object');
    expect(
      assertExists($s, 'object is not exists'),
    ).toBe($s);
  });

  it('throws an error if null is passed', () => {
    expect(
      () => assertExists(null, 'it is a null'),
    ).toThrow(new TypeError('it is a null'));
  });

  it('throws an error if undefined passed', () => {
    expect(
      () => assertExists(undefined, 'it is an undefined'),
    ).toThrow(new TypeError('it is an undefined'));
  });

  it('returns "" for ""', () => {
    expect(assertExists('', 'error')).toBe('');
  });

  it('return 0 for 0', () => {
    expect(assertExists(0, 'error')).toBe(0);
  });

  it('returns false for false', () => {
    expect(assertExists(false, 'error')).toBeFalsy();
  });
});
