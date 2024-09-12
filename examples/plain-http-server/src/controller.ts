import { IECommerceService } from './interfaces';
import { expectFound } from './utils/NotFoundError';

type Context = {
  eCommerceService: IECommerceService
}

type GetOrderByIdParams = {
  id: string
}

export const getOrders = ({ eCommerceService }: Context) =>
  eCommerceService.getOrders();

export const getOrderById = ({ eCommerceService }: Context, { id }: GetOrderByIdParams) =>
  eCommerceService
    .getOrderById(id)
    .then(expectFound(`Order ${id}`));
