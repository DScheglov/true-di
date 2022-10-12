export const memoize =
  <K extends any[]>(getKey: (...args: K) => any) =>
  <A extends [...K, ...any[]], R>(fn: (...args: A) => R) => {
    const cache = new Map<any, { result: R }>();
    return (...args: A): R => {
      const key = getKey(...args as any);
      const cached = cache.get(key);

      if (cached) return cached.result;

      const result = fn(...args);
      cache.set(key, { result });

      return result;
    };
  };
