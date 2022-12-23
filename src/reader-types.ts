// eslint-disable-next-line no-use-before-define
export type Reader<M, R> = (mod: M, run: Run<M>) => R;

export type Run<E> = <R>(reader: Reader<E, R>) => R;

export type Deps<T extends (...args: any) => any> =
  ReturnType<T> extends Reader<infer M, any> ? M : never;

export type AnyReaders<M> = {
  [field in string | symbol]: (...args: any[]) => Reader<M, any>;
};

export type BoundReaders<Th extends AnyReaders<any>> = {
  [field in keyof Th]: (...args: Parameters<Th[field]>) => ReturnType<ReturnType<Th[field]>>;
};
