import { readers } from './bind-with-module';
import { moduleScope } from './module-scope';
import { AnyReaders, BoundReaders } from './reader-types';

export const asUseCases = <
  PrM extends {},
  PbM extends {},
  ExtD extends {},
  Rs extends AnyReaders<PrM & PbM>
>(readersMap: Rs) => moduleScope<PrM, PbM, ExtD, BoundReaders<Rs>>(
  readers<PrM & PbM, Rs>(readersMap),
);
