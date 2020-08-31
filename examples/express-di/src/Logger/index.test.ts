import Logger from '.';

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    jest.spyOn(console, 'trace').mockImplementation(() => {});
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a logger object with new operator', () => {
    const logger = new Logger();

    expect(logger).toBeInstanceOf(Logger);
  });

  it('prints to console info message with .info method', () => {
    const logger = new Logger();

    logger.info('Some Message');

    expect(console.info).toHaveBeenCalledTimes(1);
    expect(console.info).toHaveBeenCalledWith(
      '0 ms:',
      {
      type: 'INFO',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Message',
    });
  });

  it('prints to console error message with .error method', () => {
    const logger = new Logger();

    logger.error(new Error('Some Error Message'));

    expect(console.trace).toHaveBeenCalledTimes(1);
    expect(console.trace).toHaveBeenCalledWith(
      '0 ms:', {
      type: 'ERROR',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Error Message',
    });
  });
});
