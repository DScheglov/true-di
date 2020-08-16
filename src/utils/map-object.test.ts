import mapObject from './map-object';
import { expectStrictType } from './type-test-utils';

describe('mapOject', () => {
  it('maps empty object to empty object', () => {
    expect(
      mapObject({}, () => { throw new Error(); }),
    ).toEqual({});
  });

  it('maps each field', () => {
    const obj = {
      x: 1,
      s: 'hello',
    };

    type Lazy<T> = () => T;
    type LazyObj<T extends object> = { [p in keyof T]: Lazy<T[p]> }

    const result = mapObject<typeof obj, keyof typeof obj, LazyObj<typeof obj>>(
      obj, (name, self) => () => self[name] as any,
    );

    expectStrictType<() => number>(result.x);
  });

  it('maps some fields', () => {
    const obj = {
      x: 1,
      y: 2,
      s: 'hello',
    };

    type Lazy<T> = () => T;
    type LazyObj<T extends object> = { [p in keyof T]: Lazy<T[p]> };
    type N = 'x' | 'y';
    type T = typeof obj;
    type D = LazyObj<Pick<T, N>>;

    const result = mapObject<T, N, D>(
      obj, (name, self) => () => self[name] as any, ['x', 'y'],
    );

    expectStrictType<{ x:() => number; y: () => number; }>(result);
    expect(result.x).toBeInstanceOf(Function);
    expect(result.y).toBeInstanceOf(Function);
    expect((result as any).z).not.toBeDefined();
  });
});
