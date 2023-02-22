import { assignProps } from './assign-props';

describe('assignProps', () => {
  it('returns assigning function', () => {
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

    const assignNameAndAge = assignProps<IContainer, 'p'>({
      name: 'z',
      age: 'x',
    });

    expect(assignNameAndAge).toBeInstanceOf(Function);
  });

  it('assigning function sets the field taken from the container', () => {
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

    const assignNameAndAge = assignProps<IContainer, 'p'>({
      name: 'z',
      age: 'x',
    });

    const person: Person = { name: '', age: 0 };
    const container: IContainer = {
      x: 5, s: 'some string', z: 'Person Name', p: person,
    };

    assignNameAndAge(person, container);

    expect(person).toEqual({
      name: container.z,
      age: container.x,
    });
  });
});
