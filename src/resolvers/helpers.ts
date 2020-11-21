export const isPromise = (value: any): value is Promise<any> =>
  typeof value?.then === 'function';

export const getFrom = <C>(container: C) => <P extends keyof C>(prop: P): C[P] =>
  container[prop];
