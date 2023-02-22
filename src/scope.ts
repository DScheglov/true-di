import { moduleScope } from './module-scope';
import { asyncScope } from './async-scope';
import { transient } from './transient-scope';
import { singleton } from './singleton-scope';

export default {
  module: moduleScope,
  transient,
  singleton,
  async: asyncScope,
};
