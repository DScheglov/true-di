import { decorated } from './decorated';
import { SESSION } from './life-cycle';
import { Resolver } from './types';

export type Session<SID> = {
  id: SID;
  expires: number;
  close: () => void;
  cache: WeakMap<Function, any>;
}

export type SessionApi<SID> = Pick<Session<SID>, 'id' | 'expires' | 'close'>;

export type SessionIdResolver<PrM extends {}, PbM extends {}, ExtD extends {}, SID> = {
  (internal: PrM & PbM, external: ExtD): SID
}

export type SessionResolver<PrM extends {}, PbM extends {}, ExtD extends {}, T, SID> = {
  (internal: PrM & PbM, external: ExtD, session: SessionApi<SID>): T
}

export type SessionScopeManager<PrM extends {}, PbM extends {}, ExtD extends {}, SID> = {
  sessionScope<RPrM extends PrM, RPbM extends PbM, RExtD extends {}, T>(
    resolver: SessionResolver<RPrM, RPbM, RExtD, T, SID>,
    initial?: [any, T],
  ): Resolver<RPrM & PrM, RPbM & PbM, RExtD & ExtD, T>
}

const createSessionScope = <PrM extends {}, PbM extends {}, ExtD extends {}, SID>(
  getSessionId: SessionIdResolver<PrM, PbM, ExtD, SID>,
  sessionTTLSec: number,
  cleanRunner: (cb: () => void) => void,
): SessionScopeManager<PrM, PbM, ExtD, SID> => {
  const sessions = new Map<SID, Session<SID>>();

  const closeSession = (id: SID) => {
    sessions.delete(id);
  };

  const closeExpiredSessions = (now: number) => Array.from(sessions.values()).forEach(
    ({ id, expires }) => (expires <= now ? closeSession(id) : undefined),
  );

  const clean = () => {
    if (sessions.size === 0) return;
    cleanRunner(() => {
      closeExpiredSessions(Date.now());
      clean();
    });
  };

  const createSession = (id: SID, expires: number) => {
    const session = {
      id,
      expires,
      cache: new WeakMap<Function, any>(),
      close: () => closeSession(id),
    };
    sessions.set(id, session);
    clean();
    return session;
  };

  const getSession = (id: SID, now: number): Session<SID> | null => {
    const session = sessions.get(id);
    if (session == null || session.expires <= now) {
      sessions.delete(id);
      return null;
    }
    session.expires = now + sessionTTLSec * 1000;
    return session;
  };

  const sessionScope = <RPrM extends PrM, RPbM extends PbM, RExtD extends {}, T>(
    resolver: SessionResolver<RPrM, RPbM, RExtD, T, SID>,
    initial?: [any, T],
  ): Resolver<RPrM & PrM, RPbM & PbM, RExtD & ExtD, T> => decorated(
      (internal: RPrM & RPbM, external: RExtD & ExtD): T => {
        const sessionId = getSessionId(internal, external);
        const {
          id, expires, cache, close,
        } =
          getSession(sessionId, Date.now()) ??
          createSession(sessionId, Date.now() + sessionTTLSec * 1000);

        if (initial && !cache.has(resolver)) {
          cache.set(resolver, initial[1]);
          return initial[1];
        }

        if (cache.has(resolver)) return cache.get(resolver) as T;

        const instance = resolver(internal, external, { id, expires, close });

        cache.set(resolver, instance);

        return instance;
      },
      resolver as any,
      'session',
      SESSION,
      true,
    );

  return {
    sessionScope,
  };
};

export default createSessionScope;
