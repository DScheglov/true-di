export const cloneFn =
  <Args extends any[], R>(fn: (...args: Args) => R) =>
    Object.defineProperty(
      (...args: Args) => fn(...args),
      'name',
      { value: fn.name },
    );
