import UniqueStack, { StackRecursionError, StackSequenceError } from '.';
import {
  isEitherRight, chainRight, isEitherLeft, chainLeft,
} from '../either';
import pipe from '../pipe';

const identity = <T>(value: T) => value;

describe('UniqueStack', () => {
  it('creates an UniqueStack', () => {
    const stack = new UniqueStack<string>();
    expect(stack).toBeInstanceOf(UniqueStack);
  });

  it('allows to add value to stack', () => {
    const stack = new UniqueStack();
    const result = stack.push(1);

    expect(isEitherRight(result)).toBeTruthy();
  });

  it('allows to get value from stack', () => {
    const stack = new UniqueStack();
    expect(
      pipe(
        stack.push(1),
        chainRight((value: number) => stack.pop(value)),
        chainRight(identity),
      ),
    ).toBe(1);
  });

  it('allows to work with stack', () => {
    const stack = new UniqueStack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    const res1 = stack.pop();
    const res2 = stack.pop();
    const res3 = stack.pop();

    expect(
      chainRight(identity)(res1),
    ).toBe(3);

    expect(
      chainRight(identity)(res2),
    ).toBe(2);

    expect(
      chainRight(identity)(res3),
    ).toBe(1);
  });

  it('returns an error when duplicated item is pushed', () => {
    const stack = new UniqueStack<number>();
    stack.push(1);
    expect(
      isEitherLeft(stack.push(1)),
    ).toBeTruthy();
  });

  it('returns an StackRecursionError when duplicated item is pushed', () => {
    const stack = new UniqueStack<number>();
    stack.push(1);
    const error = chainLeft((e: StackRecursionError) => e)(stack.push(1));
    expect(error).toBeInstanceOf(StackRecursionError);
    expect(error.message).toBe(StackRecursionError.message);
  });

  it('returns an StackSequenceError on poping from empty stack', () => {
    const stack = new UniqueStack<number>();
    const error = pipe(
      stack.pop(),
      chainLeft((e: StackRecursionError) => e),
    );
    expect(error).toBeInstanceOf(StackSequenceError);
    expect(error.message).toBe(StackSequenceError.emptyStackMessage);
  });

  it('returns an StackSequenceError if extracted item is unexpected', () => {
    const stack = new UniqueStack<number>();
    stack.push(1);
    const error = pipe(
      stack.pop(2),
      chainLeft((e: StackRecursionError) => e),
    );
    expect(error).toBeInstanceOf(StackSequenceError);
    expect(error.message).toBe(StackSequenceError.unexpectedItemMessage);
  });
});
