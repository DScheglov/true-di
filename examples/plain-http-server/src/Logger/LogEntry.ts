export type LogEntry = {
  type: 'INFO' | 'WARNING' | 'ERROR',
  timestamp: number,
  message: string,
}

const logEntryOfType = (type: LogEntry['type']) =>
  (message: LogEntry['message']): LogEntry => ({
    type,
    timestamp: Math.floor(Date.now() / 1000),
    message,
  });

export const infoLogEntry = logEntryOfType('INFO');
export const warnLogEntry = logEntryOfType('WARNING');
export const errorLogEntry = logEntryOfType('ERROR');
