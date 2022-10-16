export const descriptor = <T>(
  value: T,
  enumerable: boolean = false,
  writable: boolean = false,
  configurable: boolean = false,
) => ({
    value, enumerable, writable, configurable,
  });
