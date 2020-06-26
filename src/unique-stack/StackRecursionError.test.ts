import StackRecursionError from './StackRecursionError';

describe('StackRecursionError', () => {
  it('creates an instance of StackRecursionError', () => {
    const error = new StackRecursionError();
    expect(error).toBeInstanceOf(StackRecursionError);
  });

  it('creates an instance of Error', () => {
    const error = new StackRecursionError();
    expect(error).toBeInstanceOf(Error);
  });

  it('creates error with message: "Duplicated item has been pushed to the stack."', () => {
    const { message } = new StackRecursionError();
    expect(message).toBe(StackRecursionError.message);
  });
});
