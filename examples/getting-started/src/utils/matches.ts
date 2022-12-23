export const matches = <T>(match: Partial<T>) => {
  const fields = Object.keys(match) as Array<keyof T>;
  return (item: T) => fields.every(
    field => Object.is(item[field], match[field]),
  );
};
