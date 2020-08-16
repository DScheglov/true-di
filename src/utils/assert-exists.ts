function assertExists<T>(obj: T, message: string): T {
  if (obj == null) throw new TypeError(message);
  return obj;
}

export default assertExists;
