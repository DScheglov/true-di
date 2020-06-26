function pipe<A>(arg: A): A;

function pipe<A, R1>(
  value: A,
  f1: (arg: A) => R1
): R1;

function pipe<A, R1, R2>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
): R2;

function pipe<A, R1, R2, R3>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
): R3;

function pipe<A, R1, R2, R3, R4>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
): R4;

function pipe<A, R1, R2, R3, R4, R5>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
): R5;

function pipe<A, R1, R2, R3, R4, R5, R6>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
): R6;

function pipe<A, R1, R2, R3, R4, R5, R6, R7>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
): R7;

function pipe<A, R1, R2, R3, R4, R5, R6, R7, R8>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
): R8;

function pipe<A, R1, R2, R3, R4, R5, R6, R7, R8, R9>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
  f9: (arg: R8) => R9,
): R9;

function pipe<A, R1, R2, R3, R4, R5, R6, R7, R8, R9, RA>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
  f9: (arg: R8) => R9,
  fa: (arg: R9) => RA,
): RA;

function pipe<A, R1, R2, R3, R4, R5, R6, R7, R8, R9, RA, RB>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
  f9: (arg: R8) => R9,
  fa: (arg: R9) => RA,
  fb: (arg: RA) => RB,
): RB;

function pipe<A, R1, R2, R3, R4, R5, R6, R7, R8, R9, RA, RB, RC>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
  f9: (arg: R8) => R9,
  fa: (arg: R9) => RA,
  fb: (arg: RA) => RB,
  fc: (arg: RB) => RC,
): RC;

function pipe<A, R1, R2, R3, R4, R5, R6, R7, R8, R9, RA, RB, RC, RD>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
  f9: (arg: R8) => R9,
  fa: (arg: R9) => RA,
  fb: (arg: RA) => RB,
  fc: (arg: RB) => RC,
  fd: (arg: RC) => RD,
): RD;

function pipe<A, R1, R2, R3, R4, R5, R6, R7, R8, R9, RA, RB, RC, RD, RE>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
  f9: (arg: R8) => R9,
  fa: (arg: R9) => RA,
  fb: (arg: RA) => RB,
  fc: (arg: RB) => RC,
  fd: (arg: RC) => RD,
  fe: (arg: RD) => RE,
): RE;

function pipe<A, R1, R2, R3, R4, R5, R6, R7, R8, R9, RA, RB, RC, RD, RE, RF>(
  value: A,
  f1: (arg: A) => R1,
  f2: (arg: R1) => R2,
  f3: (arg: R2) => R3,
  f4: (arg: R3) => R4,
  f5: (arg: R4) => R5,
  f6: (arg: R5) => R6,
  f7: (arg: R6) => R7,
  f8: (arg: R7) => R8,
  f9: (arg: R8) => R9,
  fa: (arg: R9) => RA,
  fb: (arg: RA) => RB,
  fc: (arg: RB) => RC,
  fd: (arg: RC) => RD,
  fe: (arg: RD) => RE,
  ff: (arg: RF) => RF
): RF;

function pipe<A>(value: A, ...fns: Function[]): any;

function pipe <T>(value: T, ...fns: Function[]) {
  return fns.reduce((v, f) => f(v), value);
}

export default pipe;
