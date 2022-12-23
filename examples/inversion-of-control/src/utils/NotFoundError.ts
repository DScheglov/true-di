export class NotFoundError extends Error {
  constructor(entityTypeName: string) {
    super(`The ${entityTypeName} is not found.`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    Error.captureStackTrace(this, NotFoundError);
  }
}

export const expectFound = (entityTypeName: string) => <T>(value: T | null | undefined): T => {
  if (value == null) throw new NotFoundError(entityTypeName);
  return value;
};
