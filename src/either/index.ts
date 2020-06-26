export type EitherLeft<E extends Error> = [E, null];
export type EitherRight<T> = [null, T];
export type Either<T, E extends Error> = EitherLeft<E> | EitherRight<T>;

export const isEitherLeft = <T, E extends Error>([error]: Either<T, E>): boolean =>
  error != null;
export const isEitherRight = <T, E extends Error>([, value]: Either<T, E>): boolean =>
  value != null;

export const eitherLeft = <T, E extends Error>(error: E): Either<T, E> => [error, null];
export const eitherRight = <T, E extends Error>(value: T): Either<T, E> => [null, value];

export const mapLeft = <T, SE extends Error, DE extends Error>(mapper: (error: SE) => DE) =>
  (either: Either<T, SE>): Either<T, DE> => (
    isEitherLeft(either)
      ? eitherLeft(mapper(either[0]))
      : eitherRight(either[1])
  );

export const mapRight = <ST, DT, E extends Error>(mapper: (value: ST) => DT) =>
  (either: Either<ST, E>): Either<DT, E> => (
    isEitherLeft(either)
      ? eitherLeft(either[0])
      : eitherRight(mapper(either[1]))
  );

export const chainLeft = <T, E extends Error, D>(monad: (error: E) => D | undefined) =>
  (either: Either<T, E>) => (
    isEitherLeft(either) ? monad(either[0]) : undefined
  );

export const chainRight = <T, E extends Error, D>(monad: (value: T) => D | undefined) =>
  (either: Either<T, E>) => (
    isEitherLeft(either) ? undefined : monad(either[1])
  );

export const eitherOf = <T, E extends Error>(value: T | E) => (
  value instanceof Error ? eitherLeft(value) : eitherRight(value)
);

/**
 * it is designed for pipeline operator:
 * fn = () => condition ? eitherRight(ok) : eitherLeft(error);
 *
 * res = fn(x)
 *  |> mapRight(mapper)
 *  |> mapLeft(mapper)
 *  |> chainRight(chainer)
 *  |> chainLeft(chainer)
 *
 *  or
 * success = fn(x) |> isEitherRight
 */
