export enum LogLevel {
  SILENT = 0,
  ERROR = 1,
  WARNING = 2,
  INFO = 3,
  VERBOSE = 4
}

const levelsMap = new Map([
  ['SILENT', LogLevel.SILENT],
  ['ERROR', LogLevel.ERROR],
  ['WARNING', LogLevel.WARNING],
  ['INFO', LogLevel.INFO],
  ['VERBOSE', LogLevel.VERBOSE],
])

export const logLevelFromStr = (value: string = "") =>
  levelsMap.get(value.trim().toUpperCase()) ?? LogLevel.VERBOSE;