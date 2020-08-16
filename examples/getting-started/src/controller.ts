import Express from 'express';
import { sendJson } from './utils/sendJson';

export const getOrders = ({ container }: Express.Request, res: Express.Response) =>
  container
    .ecommerceService
    .getOrders()
    .then(sendJson(res));
