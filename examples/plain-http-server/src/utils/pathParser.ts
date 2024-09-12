import {
  pathToRegexp, Path, PathToRegexpOptions, ParseOptions,
} from 'path-to-regexp';

export const pathParser = (pathPattern: Path, options?: PathToRegexpOptions & ParseOptions) => {
  const { keys, regexp: pathMatcher } = pathToRegexp(pathPattern, options); // throws TypeError

  keys.unshift({ name: 'pathname', type: 'param' });

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
