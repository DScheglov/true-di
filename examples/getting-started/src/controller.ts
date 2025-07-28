import { Request, Response, NextFunction as Next } from 'express';
import { IGetOrderById, IGetOrders } from './interfaces';
import { sendJson } from './utils/sendJson';
import { expectFound } from './utils/NotFoundError';

export const getOrders = (req: Request, res: Response, next: Next) =>
  ({ eCommerceService }: { eCommerceService: IGetOrders }) =>
    eCommerceService
      .getOrders()
      .then(sendJson(res), next);

export const getOrderById = ({ params }: Request, res: Response, next: Next) =>
  ({ eCommerceService }: { eCommerceService: IGetOrderById }) =>
    eCommerceService
      .getOrderById(params.id)
      .then(expectFound(`Order(${params.id})`))
      .then(sendJson(res), next);
