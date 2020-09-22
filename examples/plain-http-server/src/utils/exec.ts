import { IncomingMessage } from 'http';
import { Path } from 'path-to-regexp';
import { pathParser } from './pathParser';

const match = <P, T, C>(pathPattern: Path, fn: (context:C, params: P) => T) => {
  const matcher = pathParser(pathPattern);
  return (context: C, { url }: IncomingMessage) => {
    const params = matcher<P>(url);
    return params != null ? fn(context, params) : null;
  }
}

const execOrNext = <A extends unknown[], R1, R2>(
  h1: (...args: A) => R1,
  h2: (...args: A) => R2
) => (...args: A) => h1(...args) ?? h2(...args);

export const firstOf = <C>(...handlers: Array<(context: C, req: IncomingMessage) => any>) => 
  handlers.length > 0
    ? handlers.reduce(execOrNext)
    : () => null;

export default match;