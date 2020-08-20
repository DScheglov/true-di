type SomeFrom<C, N extends keyof C> = { [p in N]: C[p] };
type Reader <C> = (req: Express.Request) => C;
type Handler<C, N extends keyof C> = (
  container: SomeFrom<C, N>, req: Express.Request, res: Express.Response
) => void;

export const createInjector = <C>(getContainer: Reader<C>) =>
  <N extends keyof C>(handler: Handler<C, N>) => (req: Express.Request, res: Express.Response) =>
    handler(getContainer(req), req, res);
