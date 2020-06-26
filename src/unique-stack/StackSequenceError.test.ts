import StackSequenceError from './StackSequenceError';

describe('StackSequenceError', () => {
  it('creates an instance of StackSequenceError', () => {
    const error = new StackSequenceError(StackSequenceError.emptyStackMessage);
    expect(error).toBeInstanceOf(StackSequenceError);
  });

  it('creates an instance of Error', () => {
    const error = new StackSequenceError(StackSequenceError.unexpectedItemMessage);
    expect(error).toBeInstanceOf(Error);
  });

  it('creates error with message: "Duplicated item has been pushed to the stack."', () => {
    const { message } = new StackSequenceError(StackSequenceError.emptyStackMessage);
    expect(message).toBe(StackSequenceError.emptyStackMessage);
  });
});
