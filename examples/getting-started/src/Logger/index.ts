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
  static parseLogLevel = (value: string): LogLevel | undefined => (
    /^S(?:ILENT)?$/i.test(value) ? LogLevel.SILENT :
    /^E(?:RROR)?$/i.test(value) ? LogLevel.ERROR :
    /^W(?:ARNING)?$/i.test(value) ? LogLevel.WARNING :
    /^I(?:NFO)?$/i.test(value) ? LogLevel.INFO :
    /^V(?:ERBOSE)?$/i.test(value) ? LogLevel.VERBOSE :
    undefined
  );

  constructor(
    private readonly _level: LogLevel = LogLevel.VERBOSE,
    private readonly _traceId: string = Math.random().toFixed(20).slice(2),
  ) {
    console.log(this._traceId, 'Creating Logger with logging level:', _level);
  }

  public info(message: string) {
    if (this._level < LogLevel.INFO) return;
    console.info(this._traceId, infoLogEntry(message));
  }

  public warn(message: string) {
    if (this._level < LogLevel.WARNING) return;
    console.warn(this._traceId, warnLogEntry(message));
  }

  public error(err: Error) {
    if (this._level < LogLevel.ERROR) return;
    console.error(this._traceId, errorLogEntry(err.message));
  }
}

export default Logger;
