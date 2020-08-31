import Express from 'express';

const createContext = <C extends {}>() => {
  const requestContexts = new WeakMap<Express.Request, C>();
  return {
    provideContext: (contextBuilder: (req: Express.Request) => C) => 
      (req: Express.Request, _: any, next: () => {}) => {
        requestContexts.set(req, contextBuilder(req));
        next();
      },

    fromContext: <N extends keyof C>(itemName: N) => 
      new Proxy(() => {}, {
        get(_: any, handlerName) {
          return (req: Express.Request, res: Express.Response, next: Express.NextFunction) =>
            requestContexts.get(req)[itemName][handlerName](req, res, next)
        },
        apply(_: any, __: any, [req, res, next]: [Express.Request, Express.Response, Express.NextFunction]) {
          return (requestContexts.get(req)[itemName] as unknown as Function)(req, res, next);
        }
      }) as C[N],
  };
};

export default createContext;
