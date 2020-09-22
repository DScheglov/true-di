import { ILogger } from '../interfaces';
import { LogLevel } from "./LogLevel";
import { infoLogEntry, warnLogEntry, errorLogEntry } from './LogEntry';


const silent = () => {};
const info = (message: string) => console.info(infoLogEntry(message));
const warn = (message: string) => console.warn(warnLogEntry(message));
const error = (error: Error) => console.error(errorLogEntry(error.message));

type LoggerDeps = {
  logLevel?: LogLevel
}

const Logger = ({ logLevel = LogLevel.VERBOSE }: LoggerDeps = {}): ILogger => {
  const logger = {
    info: logLevel >= LogLevel.INFO ? info : silent,
    warn: logLevel >= LogLevel.WARNING ? warn : silent,
    error: logLevel >= LogLevel.ERROR ? error : silent,
  };

  console.log(`Logger Created. Log Level is ${logLevel}`);

  return logger;
}

export default Logger;
