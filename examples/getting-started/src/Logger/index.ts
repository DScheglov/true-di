import { ILogger } from '../interfaces';
import { infoLogEntry, errorLogEntry } from './LogEntry';


class Logger implements ILogger {
  public info(message: string) {
    console.log(infoLogEntry(message));
  }

  public error<E extends Error>(err: E) {
    console.trace(errorLogEntry(err.message));
  }
}

export default Logger;