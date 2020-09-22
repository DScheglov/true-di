export interface IInfoLogger {
  info(message: string) : void;
}

export interface IWarnLogger {
  warn(message: string) : void;
}

export interface IErrorLogger {
  error<E extends Error>(err: E): void;
}

export interface ILogger extends
  IInfoLogger,
  IWarnLogger,
  IErrorLogger
{}
