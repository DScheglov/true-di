export type LogEntry = {
  requestId?: string;
  type: 'INFO' | 'WARNING' | 'ERROR',
  timestamp: number,
  message: string,
}

const logEntryOfType = (type: LogEntry['type']) =>
  (message: LogEntry['message'], requestId: string | null): LogEntry => ({
    type,
    timestamp: Math.floor(Date.now() / 1000),
    message,
    ...(requestId != null ? { requestId } : null),
  });

export const infoLogEntry = logEntryOfType('INFO');
export const warnLogEntry = logEntryOfType('WARNING');
export const errorLogEntry = logEntryOfType('ERROR');
