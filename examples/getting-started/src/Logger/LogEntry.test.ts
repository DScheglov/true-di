import { infoLogEntry, warnLogEntry, errorLogEntry } from './LogEntry';

describe('LogEntry', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(Date.now());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('allows to create INFO Log Entry with infoLogEntry factory', () => {
    expect(infoLogEntry('Some Message')).toEqual({
      type: 'INFO',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Message',
    });
  });

  it('allows to create WARNING Log Entry with errorLogEntry factory', () => {
    expect(warnLogEntry('Some Warning')).toEqual({
      type: 'WARNING',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Warning',
    });
  });

  it('allows to create ERROR Log Entry with errorLogEntry factory', () => {
    expect(errorLogEntry('Some Error Message')).toEqual({
      type: 'ERROR',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Error Message',
    });
  });
});
