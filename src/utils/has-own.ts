export const hasOwn = <T extends {}>(obj: T, fieldName: any): fieldName is keyof T =>
  Object.prototype.hasOwnProperty.call(obj, fieldName) === true;
