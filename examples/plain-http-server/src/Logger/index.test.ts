import { LogLevel } from './LogLevel';
import Logger from '.';

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('prints to console info message with .info method', () => {
    const logger = Logger();
    expect(console.info).toHaveBeenCalledTimes(0);

    logger.info('Some Message');

    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith({
      type: 'INFO',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Message',
    });
  });

  it('doesn\'t print to console info message with .info method if logLevel is less then INFO', () => {
    const logger = Logger({ logLevel: LogLevel.INFO - 1 });

    logger.info('Some Message');

    expect(console.info).not.toHaveBeenCalled();
  });

  it('prints to console warning message with .warn method', () => {
    const logger = Logger();

    logger.warn('Some Warning');

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith({
      type: 'WARNING',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Warning',
    });
  });

  it('doesn\'t print to console warning message with .warn method if logLevel is less then WARINING', () => {
    const logger = Logger({ logLevel: LogLevel.WARNING - 1 });

    logger.warn('Some Warning');

    expect(console.warn).not.toHaveBeenCalled();
  });

  it('prints to console error message with .error method', () => {
    const logger = Logger();

    logger.error(new Error('Some Error Message'));

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith({
      type: 'ERROR',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Error Message',
    });
  });

  it('doesn\'t print to console error message with .error method if logLevel is less then ERROR', () => {
    const logger = Logger({ logLevel: LogLevel.SILENT });

    logger.error(new Error('Some Error Message'));

    expect(console.error).not.toHaveBeenCalled();
  });
});
