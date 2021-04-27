import { AsyncLocalStorage } from 'async_hooks';

type Resolver<AC, T extends {}, C = any> = (container: C, context: AC) => T;

type ResolversDict<AC> = Map<Resolver<AC, {}>, any>;

type Storage<AC> = {
  context: AC,
  storage: ResolversDict<AC>;
}

const getOrCreate = <K, V>(map: Map<K, V>, key: K, create: () => V): V => {
  if (map.has(key)) return map.get(key);
  const item = create();
  map.set(key, item);
  return item;
};

const createAsyncContext = <AC>(defaultContext: AC) => {
  const asyncStorage = new AsyncLocalStorage<Storage<AC>>();

  const getInstance = <C, T extends {}>(container: C, resolver: Resolver<AC, T, C>) => {
    const { storage = new Map(), context = defaultContext } = asyncStorage.getStore() ?? {};
    return getOrCreate<Resolver<AC, {}, C>, T>(
      storage,
      resolver,
      () => resolver(container, context),
    );
  };

  const asyncContext = <C, T extends {} | Function>(
    resolver: Resolver<AC, T, C>,
  ): (container: C) => T => container => new Proxy(Object.create(null), {
      get: (_: any, name: string) => Reflect.get(
        getInstance(container, resolver), name,
      ),
      set: (_: any, name: string, value: any) => Reflect.set(
        getInstance(container, resolver),
        name,
        value,
      ),
      apply: (_: any, thisArg: any, args: any[]) => Reflect.apply(
          getInstance(container, resolver) as any,
          thisArg,
          args,
      ),
    });

  const run = (context: AC, cb: () => void) => asyncStorage.run(
    { context, storage: new Map() },
    cb,
  );

  return { asyncContext, run };
};

export default createAsyncContext;
