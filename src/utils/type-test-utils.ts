/* eslint-disable */

export type IfEquals<X, Y, A=X, B=never> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? A : B;

export const expectStrictType = <expected>(value: expected): void => {
  const newValue: IfEquals<expected, typeof value, true> = true;
};
