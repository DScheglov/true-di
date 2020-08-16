import { assignProps } from './assign-props';

describe('assignProps', () => {
  it('returns mapping function', () => {
    type Person = {
      name: string,
      age: number,
  }

    type IContainer = {
        x: number,
        s: string,
        z: string,
        p: Person,
    }

    const mapping = assignProps<IContainer, 'p'>({
      name: 'z',
      age: 'x',
    });

    expect(mapping).toBeInstanceOf(Function);
  });
});
