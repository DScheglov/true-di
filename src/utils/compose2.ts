export const compose2 = <A extends any[], R, T>(
  f: (value: R) => T,
  g: (...args: A) => R,
) => (...args: A) => f(g(...args));
