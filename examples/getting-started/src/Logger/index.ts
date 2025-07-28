import { ILogger } from '../interfaces';
import { infoLogEntry, warnLogEntry, errorLogEntry } from './LogEntry';

export enum LogLevel {
  SILENT = 0,
  ERROR = 1,
  WARNING = 2,
  INFO = 3,
  VERBOSE = 4
}

class ConsoleLogger implements ILogger {
  #level: LogLevel;

  constructor(level: LogLevel = LogLevel.VERBOSE) {
    this.#level = level;
    console.log('Logging level is', this.#level);
  }

  public info(message: string) {
    if (this.#level < LogLevel.INFO) return;
    console.info(infoLogEntry(message));
  }

  public warn(message: string) {
    if (this.#level < LogLevel.WARNING) return;
    console.warn(warnLogEntry(message));
  }

  public error(err: Error) {
    if (this.#level < LogLevel.ERROR) return;
    console.error(errorLogEntry(err.message));
  }
}

export default ConsoleLogger;
