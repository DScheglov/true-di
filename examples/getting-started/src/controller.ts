import Express from 'express';
import { sendJson } from './utils/sendJson';

export const getOrders = (
  { injected: { ecommerceService } }: Express.Request,
  res: Express.Response,
) =>
  ecommerceService
    .getOrders()
    .then(sendJson(res));
