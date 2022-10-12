export const singleton = <Args extends any[], R>(fn: (...args: Args) => R) => {
  const isCreated: boolean = false;
  let instance: R | null = null;

  const createAndSaveInstance = (...args: Args) => {
    instance = fn(...args);
    return instance;
  };

  return (...args: Args) => (isCreated ? instance : createAndSaveInstance(...args));
};
