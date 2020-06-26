import {
  eitherRight, eitherLeft, mapLeft, mapRight, eitherOf, isEitherLeft, chainLeft, chainRight,
} from '.';
import pipe from '../pipe';

describe('either', () => {
  it('allows to create function with return type Either<T, E>', () => {
    const fn = (value: number) => (
      value % 2 === 1
        ? eitherRight(value)
        : eitherLeft(new TypeError('value should be odd'))
    );

    expect(fn(1)).toEqual(eitherOf(1));
    expect(fn(2)).toEqual(eitherOf(new TypeError('value should be odd')));
  });

  it('allows to mapLeft an eitherLeft', () => {
    const result = pipe(
      eitherLeft(new Error('Error: 1')),
      mapLeft(e => new Error(`Error: <${e.message}> 2`)),
    );

    expect(result).toEqual(eitherOf(
      new Error('Error: <Error: 1> 2'),
    ));
  });

  it('allows to mapLeft an eitherRight', () => {
    const result = pipe(
      eitherRight(1),
      mapLeft(e => new Error(`Error: <${e.message}> 2`)),
    );

    expect(result).toEqual(eitherOf(1));
  });

  it('allows to mapRight an eitherRight', () => {
    expect(
      pipe(
        eitherRight(1),
        mapRight(x => x + 1),
        mapRight(x => x * 3),
      ),
    ).toEqual(eitherOf(6));
  });

  it('allows to mapRight an eitherLeft', () => {
    expect(
      pipe(
        eitherLeft(new Error('Error: 1')),
        mapRight((x: number) => x + 1),
        mapRight(x => x * 3),
      ),
    ).toEqual(eitherLeft(new Error('Error: 1')));
  });

  it('allows to chainLeft an eitherLeft', () => {
    expect(pipe(
      eitherOf(100),
      chainLeft(e => e.message),
    )).toBeUndefined();
  });

  it('allows to chainLeft an eitherRight', () => {
    expect(pipe(
      eitherOf(new Error('this is an error')),
      chainLeft(e => e.message),
    )).toBe('this is an error');
  });

  it('allows to chainRight an eitherRight', () => {
    expect(pipe(
      eitherRight(256),
      chainRight(x => Math.log2(x)),
    )).toBe(8);
  });

  it('allows to chainRight an eitherLeft', () => {
    expect(pipe(
      eitherLeft(new Error('it is an error')),
      chainRight((x: number) => Math.log2(x)),
    )).toBeUndefined();
  });

  it('allows to identify if either is left', () => {
    expect(pipe(
      eitherOf(new Error('it is an error')),
      isEitherLeft,
    )).toBeTruthy();
  });

  it('allows to identify is either is not left', () => {
    expect(pipe(
      eitherOf(100),
      isEitherLeft,
    )).toBeFalsy();
  });
});
