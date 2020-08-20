import Express from 'express';
import { createInjector } from './create-injector';

const expressDi = <C>(containerFactory: (req: Express.Request) => C) => {
  const containers = new WeakMap<Express.Request, C>();
  return {
    addInjectionContext: (req: Express.Request, _: any, next: () => {}) => {
      containers.set(req, containerFactory(req));
      next();
    },

    injectTo: createInjector<C>((req: Express.Request) => containers.get(req)),
  };
};

export default expressDi;
