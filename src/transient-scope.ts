import { decorated } from './decorated';
import { TRANSIENT } from './life-cycle';
import { Resolver } from './types';

export const transient = <PrM extends {}, PbM extends {}, ExtD extends {}, T>(
  resolver: Resolver<PrM, PbM, ExtD, T>,
  force: boolean = true,
): Resolver<PrM, PbM, ExtD, T> => decorated(
    (intD: PrM & PbM, extD: ExtD) => resolver(intD, extD),
    resolver,
    'transient',
    TRANSIENT,
    force,
    transient,
  );
