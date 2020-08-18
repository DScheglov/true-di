declare namespace Express {
  export interface Request {
    container: import('./IContainer').IContainer;
  }
}
