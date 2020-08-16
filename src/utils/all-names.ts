const allNames = <C extends object>(obj: C): Array<keyof C> =>
  (Object.getOwnPropertyNames(obj) as Array<string | symbol>)
    .concat(Object.getOwnPropertySymbols(obj)) as Array<keyof C>;

export default allNames;
