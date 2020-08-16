import assert from 'assert';
import { ILogger } from '../interfaces';

export type LogEntry = {
  type: 'error' | 'info'
  message: string
  errorName?: string
  dateTime: number,
}

const currentUnixTime = () => Date.now() / 1000 | 0;

class Logger implements ILogger {
  constructor(
    private readonly _entires: LogEntry[] = [],
    private readonly _depth: number = -1,
  ) {
    assert(
      _depth === -1 || _depth > 0, 
      'Depth should be greater then 0 or equal to -1'
    )

    setInterval(
      this._printLog,
      5000
    )
  }

  private _printLog = () => {
    const { _entires } = this;

    if (_entires.length === 0) return;

    console.table(_entires);
    _entires.splice(0, _entires.length);
  }

  private _cutOldEntries() {
    const { _depth, _entires } = this;
    if (_depth < 0) return;
    
    _entires.splice(
      0,
      Math.max(0, _entires.length - _depth)
    )
  }

  public info(message: string) {
    this._entires.push({ 
      type: 'info',
      message, 
      dateTime: currentUnixTime(),
    })
    this._cutOldEntries();
  }

  public error<E extends Error>(err: E) {
    this._entires.push({
      type: 'error',
      message: err.message,
      errorName: err.name,
      dateTime: currentUnixTime(),
    })

    this._cutOldEntries();
  }
}

export default Logger;