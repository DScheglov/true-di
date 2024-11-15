import { Request, Response, NextFunction as Next } from 'express';
import { IGetOrderById, IGetOrders } from './interfaces';
import { sendJson } from './utils/sendJson';
import { expectFound } from './utils/NotFoundError';

export const getOrders = (req: Request, res: Response, next: Next) =>
  ({ ecommerceService }: { ecommerceService: IGetOrders }) =>
    ecommerceService
      .getOrders()
      .then(sendJson(res), next);

export const getOrderById = ({ params }: Request, res: Response, next: Next) =>
  ({ ecommerceService }: { ecommerceService: IGetOrderById }) =>
    ecommerceService
      .getOrderById(params.id)
      .then(expectFound(`Order(${params.id})`))
      .then(sendJson(res), next);
