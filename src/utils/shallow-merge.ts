export type Merge<T1 extends object, T2 extends object> =
  Omit<T1, keyof T2> & T2; // Overriding Join

type IShallowMergeFn = {
  <T1 extends object>(
    obj1: T1,
  ): T1;

  <
    T1 extends object,
    T2 extends object
  >(
    obj1: T1,
    obj2: T2,
  ): Merge<T1, T2>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
  ): Merge<
    Merge<T1, T2>, T3>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
  ): Merge<
    Merge<
    Merge<T1, T2>, T3>, T4>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object,
    T5 extends object,
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
    obj5: T5,
  ): Merge<
    Merge<
    Merge<
    Merge<T1, T2>, T3>, T4>, T5>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object,
    T5 extends object,
    T6 extends object,
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
    obj5: T5,
    obj6: T6,
  ): Merge<
    Merge<
    Merge<
    Merge<
    Merge<T1, T2>, T3>, T4>, T5>, T6>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object,
    T5 extends object,
    T6 extends object,
    T7 extends object,
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
    obj5: T5,
    obj6: T6,
    obj7: T7,
  ): Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<T1, T2>, T3>, T4>, T5>, T6>, T7>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object,
    T5 extends object,
    T6 extends object,
    T7 extends object,
    T8 extends object,
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
    obj5: T5,
    obj6: T6,
    obj7: T7,
    obj8: T8,
  ): Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<T1, T2>, T3>, T4>, T5>, T6>, T7>, T8>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object,
    T5 extends object,
    T6 extends object,
    T7 extends object,
    T8 extends object,
    T9 extends object,
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
    obj5: T5,
    obj6: T6,
    obj7: T7,
    obj8: T8,
    obj9: T9,
  ): Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<T1, T2>, T3>, T4>, T5>, T6>, T7>, T8>, T9>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object,
    T5 extends object,
    T6 extends object,
    T7 extends object,
    T8 extends object,
    T9 extends object,
    TA extends object,
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
    obj5: T5,
    obj6: T6,
    obj7: T7,
    obj8: T8,
    obj9: T9,
    objA: TA,
  ): Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<T1, T2>, T3>, T4>, T5>, T6>, T7>, T8>, T9>, TA>;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object,
    T5 extends object,
    T6 extends object,
    T7 extends object,
    T8 extends object,
    T9 extends object,
    TA extends object,
    TB extends object,
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
    obj5: T5,
    obj6: T6,
    obj7: T7,
    obj8: T8,
    obj9: T9,
    objA: TA,
    objB: TB,
  ): Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    T1, T2>, T3>, T4>, T5>, T6>, T7>, T8>, T9>, TA>, TB
  >;

  <
    T1 extends object,
    T2 extends object,
    T3 extends object,
    T4 extends object,
    T5 extends object,
    T6 extends object,
    T7 extends object,
    T8 extends object,
    T9 extends object,
    TA extends object,
    TB extends object,
    TC extends object,
  >(
    obj1: T1,
    obj2: T2,
    obj3: T3,
    obj4: T4,
    obj5: T5,
    obj6: T6,
    obj7: T7,
    obj8: T8,
    obj9: T9,
    objA: TA,
    objB: TB,
    objC: TC,
  ): Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    Merge<
    T1, T2>, T3>, T4>, T5>, T6>, T7>, T8>, T9>, TA>, TB>, TC
  >;
}

export const shallowMerge: IShallowMergeFn = <C extends Object>(...objects: C[]): C =>
  objects.reduce(
    (newObject, obj) => Object.defineProperties(newObject, Object.getOwnPropertyDescriptors(obj)),
    Object.create(null),
  );
