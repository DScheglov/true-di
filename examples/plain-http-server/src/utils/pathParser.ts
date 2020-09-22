import {
  pathToRegexp, Path, Key, TokensToRegexpOptions, ParseOptions,
} from 'path-to-regexp';

export const pathParser = (pathPattern: Path, options?: TokensToRegexpOptions & ParseOptions) => {
  const keys: Key[] = [];
  const pathMatcher = pathToRegexp(pathPattern, keys, options); // throws TypeError

  keys.unshift({
    name: 'pathname',
    prefix: '',
    suffix: '',
    pattern: '',
    modifier: '',
  });

  return <T extends {}>(path: string): T | null => {
    const parsingResult = pathMatcher.exec(path);

    return parsingResult && parsingResult.reduce(
      (params, value, index) => Object.defineProperty(
        params, keys[index].name, { value, enumerable: true },
      ),
      Object.create(null) as T,
    );
  };
};
