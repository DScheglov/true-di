import allNames from './all-names';

const narrowObject = <T extends object, N extends keyof T>(
  obj: T,
  names: N[] = allNames(obj) as N[],
): Pick<T, N> => names.reduce(
    (newObj, key) => Object.defineProperty(newObj, key, Object.getOwnPropertyDescriptor(obj, key)!),
    Object.create(null) as Pick<T, N>,
  );

export default narrowObject;
