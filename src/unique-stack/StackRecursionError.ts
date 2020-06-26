interface StackRecursionError extends Error {
  new (): StackRecursionError
}

const StackRecursionError = function _StackSequenceError(
  this: StackRecursionError,
) {
  const error = new Error(StackRecursionError.message);
  Object.setPrototypeOf(error, StackRecursionError.prototype);
  return error as StackRecursionError;
} as any as {
  new (): StackRecursionError;
  message: string;
};

StackRecursionError.message = 'Duplicated item has been pushed to the stack.';
StackRecursionError.prototype = Object.create(Error.prototype);
StackRecursionError.prototype.name = 'StackRecursionError';

export default StackRecursionError;
