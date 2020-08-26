declare namespace Express {
  export interface Request {
    injected: import('./IContainer').IContainer;
  }
}
