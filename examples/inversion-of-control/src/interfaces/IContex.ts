export interface IContext {
  requestId: string | null;
}

export interface IContextManager {
  setRequestId(requestId: string): void;
}
