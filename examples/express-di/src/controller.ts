import Express from 'express';
import { IECommerceService } from './interfaces';
import { sendJson } from './utils/sendJson';

type ControllerDeps = { ecommerceService: IECommerceService };

export const getOrders = ({ ecommerceService }: ControllerDeps, _: any, res: Express.Response) =>
  ecommerceService
    .getOrders()
    .then(sendJson(res));
