export const TRANSIENT = 100 as const;
export const ASYNC = 200 as const;
export const MODULE = 300 as const;
export const SESSION = 400 as const;
export const SINGLETON = 500 as const;

export const LIFE_CYCLE = {
  TRANSIENT,
  ASYNC,
  MODULE,
  SESSION,
  SINGLETON,
};

export type LC_TRANSIENT = typeof TRANSIENT;
export type LC_ASYNC = typeof ASYNC;
export type LC_MODULE = typeof MODULE;
export type LC_SESSION = typeof SESSION;
export type LC_SINGLETON = typeof SINGLETON;

export type LifeCycle = typeof LIFE_CYCLE[keyof typeof LIFE_CYCLE];

export const shouldOverrideLifeCycle = (lifeCycle: LifeCycle) => lifeCycle < MODULE;

export const overrideLifeCycle = (newLc: LifeCycle, currLc: LifeCycle = MODULE): LifeCycle => (
  newLc < currLc
    ? newLc
    : currLc
);
