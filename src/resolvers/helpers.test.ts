import { getFrom, isPromise } from './helpers';

describe('getFrom', () => {
  it('returns a function', () => {
    const container: { x: number, y: string } = { x: 1, y: 'text' };
    const getFromContainer: (name: 'x' | 'y') => number | string = getFrom(container);
    expect(getFromContainer).toBeInstanceOf(Function);
  });

  it('returns field value form container', () => {
    const container: { x: number, y: string } = { x: 1, y: 'text' };
    const getFromContainer: (name: 'x' | 'y') => number | string = getFrom(container);
    expect(getFromContainer('x')).toBe(1);

    expect(getFromContainer('y')).toBe('text');
  });
});

describe('isPromise', () => {
  it.each([
    0, null, undefined, () => {}, 1, 'text', '', new Date(), { x: 1, y: 2 },
    [1, 2], [Promise.resolve()], { x: Promise.resolve() },
  ])('returns false for %j', value => {
    expect(isPromise(value)).toBe(false);
  });

  it.each([
    Promise.resolve(), Promise.resolve(1), Promise.resolve(null), Promise.resolve(1),
    Promise.resolve(new Date()), Promise.reject(), Promise.reject(new Error('some error')),
  ])('returns true for %s', value => {
    expect(isPromise(value)).toBe(true);
    value.catch(() => {}); // supressing rejected promisses
  });
});
