/* eslint-disable */

type Fn<R> = <T>() => T extends R ? 1 : 2;

export type IfEquals<X, Y, A=X, B=never> = Fn<X> extends Fn<Y> ? A : B;

export const expectStrictType = <expected>(value: expected): void => {
  const newValue: IfEquals<expected, typeof value, true> = true;
};
