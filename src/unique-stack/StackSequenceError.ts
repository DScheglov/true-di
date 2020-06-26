interface StackSequenceError extends Error {
  new (message: string): StackSequenceError
}

const StackSequenceError = function _StackSequenceError(this: StackSequenceError, message: string) {
  const error = new Error(message);
  Object.setPrototypeOf(error, StackSequenceError.prototype);
  return error as StackSequenceError;
} as any as {
  new (message: string): StackSequenceError;
  emptyStackMessage: string;
  unexpectedItemMessage: string
};

StackSequenceError.emptyStackMessage = 'Trying to extract item from the empty stack';
StackSequenceError.unexpectedItemMessage = 'Extracted item is not equal to expected one';

StackSequenceError.prototype = Object.create(Error.prototype);
StackSequenceError.prototype.name = 'StackSequenceError';

export default StackSequenceError;
