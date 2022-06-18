import narrowObject from './narrow-object';

describe('narrowObject', () => {
  it('returns the copy if no names are specified', () => {
    const object = {
      x: 1, y: 2,
    };

    expect(narrowObject(object)).toEqual(object);
  });

  it('returns the narrowed object if names are specified', () => {
    const object = { x: 1, y: 2, z: 3 };
    const newObject = narrowObject(object, ['x']);
    expect(newObject).toEqual({ x: 1 });
  });
});
