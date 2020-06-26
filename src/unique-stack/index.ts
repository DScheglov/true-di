import { Either, eitherLeft, eitherRight } from '../either';
import StackRecursionError from './StackRecursionError';
import StackSequenceError from './StackSequenceError';

export type StackError = StackRecursionError | StackSequenceError;

export {
  StackRecursionError,
  StackSequenceError,
};

class UniqueStack<T> {
  private readonly stack: T[] = []

  private readonly set: Set<T> = new Set()

  push(item: T): Either<T, StackRecursionError> {
    if (this.set.has(item)) return eitherLeft(new StackRecursionError());
    this.stack.unshift(item);
    this.set.add(item);
    return eitherRight(item);
  }

  pop(expected?: T): Either<T, StackSequenceError> {
    if (this.stack.length === 0) {
      return eitherLeft(new StackSequenceError(StackSequenceError.emptyStackMessage));
    }

    const last = this.stack.shift();
    this.set.delete(last);

    return (
      expected === undefined || last === expected
        ? eitherRight(last)
        : eitherLeft(new StackSequenceError(StackSequenceError.unexpectedItemMessage))
    );
  }

  get size(): number {
    return this.stack.length;
  }
}

export default UniqueStack;
