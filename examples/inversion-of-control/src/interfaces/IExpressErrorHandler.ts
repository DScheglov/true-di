import type { Request, Response } from 'express';

export interface IExpressErrorHandler {
  handleErrors(err: Error, req: Request, res: Response, next: any): void;
}
