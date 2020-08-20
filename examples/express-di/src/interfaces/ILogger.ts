export interface ILogger {
  info(message: string) : void;
  error<E extends Error>(err: E): void;
}
