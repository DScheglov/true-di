import { Request, Response, NextFunction as Next } from 'express';

export interface IOrdersExpressController {
  getOrders(req: Request, res: Response, next: Next): Promise<void>;
  getOrderById({ params }: Request<{ id: string }>, res: Response, next: Next): Promise<void>;
}
