import Express from 'express';
import { IGetOrderById, IGetOrders } from './interfaces';
import { Injected } from './interfaces/IRequestInjected';
import { sendJson } from './utils/sendJson';
import { expectFound } from './utils/NotFoundError';

export const getOrders = (
  { injected: { ecommerceService } }: Injected<{ ecommerceService: IGetOrders }>,
  res: Express.Response,
  next: Express.NextFunction,
) =>
  ecommerceService
    .getOrders()
    .then(sendJson(res), next);

export const getOrderById = (
  { params, injected: { ecommerceService } }:
    { params: { id: string } } & Injected<{ ecommerceService: IGetOrderById }>,
  res: Express.Response,
  next: Express.NextFunction,
) =>
  ecommerceService
    .getOrderById(params.id)
    .then(expectFound(`Order(${params.id})`))
    .then(sendJson(res), next);
