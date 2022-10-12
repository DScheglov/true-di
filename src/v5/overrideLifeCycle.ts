import { LifeCycle } from './types';

const lcIndex = (lc: LifeCycle): number => (
  lc === 'transient' ? 0 :
  lc === 'async' ? 1 :
  lc === 'module' ? 2 :
  lc === 'singleton' ? 3 :
  100
);

export const overrideLifeCycle = (newLc: LifeCycle, currLc: LifeCycle = 'module'): LifeCycle => (
  (newLc === 'transient' || newLc === 'async') && lcIndex(newLc) < lcIndex(currLc)
    ? newLc
    : currLc
);
