import { ILogger } from '../interfaces';
import { infoLogEntry, errorLogEntry } from './LogEntry';

class Logger implements ILogger {
  constructor(
    private readonly startTimeStamp: number = Date.now(),
  ) {}

  private msecPassed(): number {
    return Date.now() - this.startTimeStamp;
  }

  public info(message: string) {
    console.info(`${this.msecPassed()} ms:`, infoLogEntry(message));
  }

  public error(err: Error) {
    console.trace(`${this.msecPassed()} ms:`, errorLogEntry(err.message));
  }
}

export default Logger;
