import { ILogger } from '../interfaces';
import { infoLogEntry, warnLogEntry, errorLogEntry } from './LogEntry';

export enum LogLevel {
  SILENT = 0,
  ERROR = 1,
  WARNING = 2,
  INFO = 3,
  VERBOSE = 4
}

class Logger implements ILogger {
  constructor(
    private readonly _requestId: string | null,
    private readonly _level: LogLevel = LogLevel.VERBOSE,
  ) {
    console.log(this._requestId, 'Logging level is', _level);
  }

  public info(message: string) {
    if (this._level < LogLevel.INFO) return;
    console.info(infoLogEntry(message, this._requestId));
  }

  public warn(message: string) {
    if (this._level < LogLevel.WARNING) return;
    console.warn(warnLogEntry(message, this._requestId));
  }

  public error(err: Error) {
    if (this._level < LogLevel.ERROR) return;
    console.error(errorLogEntry(err.message, this._requestId));
  }
}

export default Logger;
