import { pathParser } from './pathParser';

describe('pathParser', () => {
  it('creates a function', () => {
    expect(pathParser('/')).toBeInstanceOf(Function);
  });

  it('throws an exeption if pathPattern is not valid', () => {
    expect(
      () => pathParser('?'),
    ).toThrow(TypeError);
  });

  it.each([
    ['/', '/', { pathname: '/' }],
    ['/', '/root', null],
    ['/root', '/root', { pathname: '/root' }],
    ['/root', '/', null],
    ['/root/node/node', '/root/node/node', { pathname: '/root/node/node' }],
    ['/root/node/node', '/root/node/', null],
    ['/root/:id', '/root/123', { pathname: '/root/123', id: '123' }],
  ])(
    'pathParser(%j)(%j) -> %j', (pattern, path, result) => {
      expect(
        pathParser(pattern)(path),
      ).toEqual(result);
    },
  );
});
