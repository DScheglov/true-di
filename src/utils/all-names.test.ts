import allNames from './all-names';

describe('allNames', () => {
  it('returns field names from object', () => {
    expect(
      allNames({ x: 1, y: 2 }),
    ).toEqual(['x', 'y']);
  });

  it('returns symbolic names too', () => {
    const $field = Symbol('symbolic field');
    expect(
      allNames({ x: 1, [$field]: $field }),
    ).toEqual(['x', $field]);
  });

  it('works with null-prototpyed objects', () => {
    const obj = Object.create(null);
    obj.x = 1;
    obj.y = 'y';

    expect(
      allNames(obj),
    ).toEqual(['x', 'y']);
  });

  it('works with null-prototpyed objects and symbolic names', () => {
    const obj = Object.create(null);
    const $field = Symbol('symbolic name');
    obj.x = 1;
    obj.y = 'y';
    obj[$field] = $field;

    expect(
      allNames(obj),
    ).toEqual(['x', 'y', $field]);
  });
});
