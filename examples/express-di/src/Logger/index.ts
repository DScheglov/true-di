import { ILogger } from '../interfaces';
import { infoLogEntry, errorLogEntry } from './LogEntry';

class Logger implements ILogger {
  public info(message: string) {
    console.info(infoLogEntry(message));
  }

  public error(err: Error) {
    console.trace(errorLogEntry(err.message));
  }
}

export default Logger;
