import { IECommerceService } from './interfaces';
import { expectFound } from './utils/NotFoundError';

type Context = {
  ecommerceService: IECommerceService
}

type GetOrderByIdParams = {
  id: string
}

export const getOrders = ({ ecommerceService }: Context) =>
  ecommerceService.getOrders();

export const getOrderById = ({ ecommerceService }: Context, { id }: GetOrderByIdParams) =>
  ecommerceService
    .getOrderById(id)
    .then(expectFound(`Order ${id}`));
