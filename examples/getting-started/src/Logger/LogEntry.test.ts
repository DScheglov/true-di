import { infoLogEntry, errorLogEntry } from './LogEntry';

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

  it('allows to create ERROR Log Entry with errorLogEntry factory', () => {
    expect(errorLogEntry('Some Error Message')).toEqual({
      type: 'ERROR',
      timestamp: Math.floor(Date.now() / 1000),
      message: 'Some Error Message',
    });
  });
});
