import alsContextProvider from './als-context-provider';

describe('alsContextProvider', () => {
  const { get, run } = alsContextProvider;

  const isPromise = (value: any): value is Promise<any> => value != null && typeof value.then === 'function';

  const withRun = <C, T>(context: C, cb: (ctx: C) => T | Promise<T>) =>
    new Promise<T>((resolve, reject) => {
      setTimeout(() => run(context, () => {
        try {
          const ctx = get<C>();
          const result = cb(ctx);
          return isPromise(result) ? result.then(resolve, reject) : resolve(result);
        } catch (err) {
          return reject(err);
        }
      }));
    });

  it('is an object implementing Context Provider interface', () => {
    expect(get).toBeInstanceOf(Function);
    expect(run).toBeInstanceOf(Function);
  });

  it('allows to get context inside of running', async () => {
    expect.assertions(2);

    const [s1, s2] = [Symbol('s1'), Symbol('s2')];
    const e1 = withRun(s1, context => context);
    const e2 = withRun(s2, context => context);

    await expect(e1).resolves.toBe(s1);
    await expect(e2).resolves.toBe(s2);
  });

  it('allows to get context inside of running (async cb)', async () => {
    expect.assertions(2);

    const [s1, s2] = [Symbol('s1'), Symbol('s2')];
    const e1 = withRun(s1, async context => context);
    const e2 = withRun(s2, async context => context);

    await expect(e1).resolves.toBe(s1);
    await expect(e2).resolves.toBe(s2);
  });
});
