import { NotFoundError, expectFound } from './NotFoundError';

describe('NotFoundError', () => {
  it('creates an instance of Error', () => {
    expect(new NotFoundError('Entity')).toBeInstanceOf(Error);
  });

  it('created an instance of NotFoundError', () => {
    expect(new NotFoundError('Entity')).toBeInstanceOf(NotFoundError);
  });

  it('creates an error with message: "The Entity is not found."', () => {
    expect(new NotFoundError('Entity').message).toBe('The Entity is not found.');
  });
});

describe('expectFound', () => {
  it('is a closure', () => {
    expect(expectFound('Entity')).toBeInstanceOf(Function);
  });

  it('returns value if it is not null or undefined', () => {
    const obj = {};

    expect(expectFound('Entity')(obj)).toBe(obj);
  });

  it('throws an error if value is null', () => {
    expect(
      () => expectFound('Entity')(null),
    ).toThrow(new NotFoundError('Entity'));
  });

  it('throws an error if value is undefined', () => {
    expect(
      () => expectFound('Entity')(undefined),
    ).toThrow(new NotFoundError('Entity'));
  });
});
