export const fakeFloat = (min: number, max: number) => Math.random() * (max - min) + min;

export const fakeInt = (min: number, max: number) => Math.round(fakeFloat(min, max));

export const fakeItemOf = <T>(list: T[]) => (): T => list[fakeInt(0, list.length - 1)];

export const fakePrice = (min: number, max: number, fractionDigits: number = 2) => 
  parseFloat(fakeFloat(min, max).toFixed(fractionDigits));