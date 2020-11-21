import { expectStrictType } from './types';
import UniqueStack from './unique-stack';

describe('UniqueStack', () => {
  it('implements UniqueStack Interface', () => {
    const stack = UniqueStack<string>();

    type Expected = {
      push:(value: string) => [Error, null] | [null, string],
      pop: (expected?: string) => [Error, null] | [null, string],
      readonly size: number,
    };

    expectStrictType<Expected>(stack);
  });

  it('allows to add value to stack', () => {
    const stack = UniqueStack();
    const result = stack.push(1);

    expect(result[1]).toBeTruthy();
  });

  it('allows to get value from stack', () => {
    const stack = UniqueStack();
    stack.push(1);
    expect(stack.pop(1)[1]).toBe(1);
  });

  it('allows to work with stack', () => {
    const stack = UniqueStack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    const [, res1] = stack.pop();
    const [, res2] = stack.pop();
    const [, res3] = stack.pop();

    expect(res1).toBe(3);

    expect(res2).toBe(2);

    expect(res3).toBe(1);
  });

  it('returns an error when duplicated item is pushed', () => {
    const stack = UniqueStack<number>();
    stack.push(1);
    expect(stack.push(1)[0]).toBeTruthy();
  });

  it('returns an StackRecursionError when duplicated item is pushed', () => {
    const stack = UniqueStack<number>();
    stack.push(1);
    const [error] = stack.push(1);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Duplicated item has been pushed to the stack.');
  });

  it('returns an StackSequenceError on poping from empty stack', () => {
    const stack = UniqueStack<number>();
    const [error] = stack.pop();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Trying to extract item from the empty stack');
  });

  it('returns an StackSequenceError if extracted item is unexpected', () => {
    const stack = UniqueStack<number>();
    stack.push(1);
    const [error] = stack.pop(2);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Extracted item is not equal to expected one');
  });
});
