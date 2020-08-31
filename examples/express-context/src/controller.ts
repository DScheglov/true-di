import Express from 'express';
import { IECommerceService } from './interfaces';
import { sendJson } from './utils/sendJson';

export const getOrdersFactory = ({ ecommerceService }: { ecommerceService: IECommerceService }) => 
  (_: any, res: Express.Response) =>
    ecommerceService
      .getOrders()
      .then(sendJson(res));