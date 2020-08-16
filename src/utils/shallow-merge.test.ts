import { expectStrictType } from './type-test-utils';
import { shallowMerge } from './shallow-merge';

describe('shallowMerge', () => {
  it('copies an object if only one is passed', () => {
    const obj = {
      x: 1, y: 'y',
    };

    const newObj: {
      x: number,
      y: string
    } = shallowMerge(obj);

    expect(newObj).toEqual(obj);
    expect(newObj).not.toBe(obj);
  });

  it('copies an object if only one is passed including symbolic names', () => {
    const $field = Symbol('symbolic name');
    const obj = {
      x: 1, y: 'y', [$field]: new Date(),
    };

    const newObj: {
      x: number,
      y: string,
      [$field]: Date,
    } = shallowMerge(obj);

    expect(newObj).toEqual(obj);
    expect(newObj).not.toBe(obj);
  });

  it('merges two objects', () => {
    const t = () => {};

    const obj1 = {
      x: 1, y: 'y',
    };

    const obj2 = {
      z: true, t,
    };

    const newObj = shallowMerge(obj1, obj2);

    type ResultObjType = {
      x: number,
      y: string,
      z: boolean,
      t: () => void,
    };

    expectStrictType<ResultObjType>(newObj);

    expect(newObj).toEqual({
      x: 1, y: 'y', z: true, t,
    });

    expect(newObj).not.toBe(obj1);
    expect(newObj).not.toBe(obj2);
  });

  it('merges two objects with intercepted sets of fields', () => {
    const t = () => {};

    const obj1 = {
      x: 1, y: 'y', t: false,
    };

    const obj2 = {
      z: true, t,
    };

    const newObj = shallowMerge(obj1, obj2);

    type ResultObjType = {
      x: number;
      y: string;
      z: Boolean;
      t:() => void;
    }

    expectStrictType<ResultObjType>(newObj);

    expect(newObj).toEqual({
      x: 1, y: 'y', z: true, t,
    });

    expect(newObj).not.toBe(obj1);
    expect(newObj).not.toBe(obj2);
  });
});
