declare namespace Express {
  export interface Request {
    injected: import('./IRequestInjected').RequestInjected;
  }
}
