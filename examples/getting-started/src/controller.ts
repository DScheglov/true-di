import { Request, Response, NextFunction as Next } from 'express';
import { IGetOrderById, IGetOrders } from './interfaces';
import { sendJson } from './utils/sendJson';
import { expectFound } from './utils/NotFoundError';

type Dependencies = { ecommerceService: IGetOrders & IGetOrderById };

const ordersController = ({ ecommerceService }: Dependencies) => ({
  getOrders: (req: Request, res: Response, next: Next) =>
    ecommerceService
      .getOrders()
      .then(sendJson(res), next),

  getOrderById: ({ params }: Request<{ id: string }>, res: Response, next: Next) =>
    ecommerceService
      .getOrderById(params.id)
      .then(expectFound(`Order(${params.id})`))
      .then(sendJson(res), next),

});

export default ordersController;
