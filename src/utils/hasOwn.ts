export const hasOwn = (obj: any, property: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(obj, property);
