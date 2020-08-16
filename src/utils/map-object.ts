import allNames from './all-names';

const mapObject = <
  SrcType extends object,
  Names extends keyof SrcType,
  DestType extends { [p in Names]: any }
>(
    obj: SrcType,
    mapper: <p extends Names>(name: p, self: SrcType) => DestType[p],
    names: Names[] = allNames(obj) as Names[],
  ): DestType => names.reduce(
    (newObj, key) => Object.defineProperty(newObj, key, {
      enumerable: Object.getOwnPropertyDescriptor(obj, key).enumerable,
      value: mapper(key, obj),
    }),
    Object.create(null),
  );

export default mapObject;
