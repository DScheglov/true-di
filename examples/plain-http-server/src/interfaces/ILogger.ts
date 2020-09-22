export interface IInfoLogger {
  info(message: string) : void;
}

export interface IWarnLogger {
  warn(message: string) : void;
}

export interface IErrorLogger {
  error(error: Error): void;
}

export interface ILogger extends
  IInfoLogger,
  IWarnLogger,
  IErrorLogger
{}
