export type LogEntry = {
	type: 'INFO' | 'ERROR',
	timestamp: number,
	message: string,
}

const logEntryOfType = (type: LogEntry['type']) =>
  (message: LogEntry['message']): LogEntry => ({
    type,
    timestamp: Date.now() / 1000 | 0,
    message,
  });

export const infoLogEntry = logEntryOfType('INFO');
export const errorLogEntry = logEntryOfType('ERROR');