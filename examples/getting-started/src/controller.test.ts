import { AssertionError } from 'assert';
import Express from 'express';
import { getOrderById, getOrders } from './controller';
import { IGetOrderById, IGetOrders, Order } from './interfaces';
import { NotFoundError } from './utils/NotFoundError';

const fakeGetOrdersService = (orders: Order[]): IGetOrders => ({
  getOrders: jest.fn(async (): Promise<Order[]> => orders),
});

const fakeGetOrderByIdService = (orders: Order[]): IGetOrderById => ({
  getOrderById: jest.fn(async (): Promise<Order|null> => orders[0]),
});

function returnThis<T>(this: T):T { return this; }

const fakeResponse = (): Express.Response => ({
  type: jest.fn(returnThis),
  send: jest.fn(returnThis),
}) as any;

const fakeRequest = <P extends {} >(params: P = {} as P): Express.Request<P> => ({ params }) as any;

describe('controller.getOrders', () => {
  it('sends json received from the eCommerceService.getOrders', async () => {
    expect.assertions(4);

    const eCommerceService = fakeGetOrdersService([]);
    const res = fakeResponse();
    const next = jest.fn();

    await getOrders(fakeRequest(), res, next)({ eCommerceService });

    expect(eCommerceService.getOrders).toHaveBeenCalledTimes(1);
    expect(res.type).toHaveBeenCalledWith('application/json');
    expect(res.send).toHaveBeenCalledWith('[]');
    expect(next).not.toHaveBeenCalled();
  });
});

describe('controller.getOrderById', () => {
  it('sends json received from the eCommerceService.getOrderById', async () => {
    expect.assertions(5);
    const eCommerceService = fakeGetOrderByIdService([{} as Order]);
    const res = fakeResponse();
    const next = jest.fn();

    await getOrderById(
      fakeRequest({ id: '0c6dc1ff-b678-475a-a8cd-13a05525ab11' }),
      res,
      next,
    )({ eCommerceService });

    expect(eCommerceService.getOrderById).toHaveBeenCalledTimes(1);
    expect(eCommerceService.getOrderById).toHaveBeenCalledWith('0c6dc1ff-b678-475a-a8cd-13a05525ab11');
    expect(res.type).toHaveBeenCalledWith('application/json');
    expect(res.send).toHaveBeenCalledWith('{}');
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next function with NotFoundError if order is not found', async () => {
    expect.assertions(4);
    const eCommerceService = fakeGetOrderByIdService([null as any]);
    const res = fakeResponse();
    const next = jest.fn();

    await getOrderById(
      fakeRequest({ id: '0c6dc1ff-b678-475a-a8cd-13a05525ab11' }),
      res,
      next,
    )({ eCommerceService });

    expect(eCommerceService.getOrderById).toHaveBeenCalledTimes(1);
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new NotFoundError('Order(0c6dc1ff-b678-475a-a8cd-13a05525ab11)'));
  });

  it('calls next function with AssertionError if id is not a valid UUID', async () => {
    expect.assertions(5);
    const eCommerceService = {
      getOrderById: jest.fn(async (id: string): Promise<Order|null> => {
        throw new AssertionError({ message: `${id} is not a UUID` });
      }),
    };
    const res = fakeResponse();
    const next = jest.fn();

    await getOrderById(
      fakeRequest({ id: '0c6dc1ff-b678-475a-a8cd' }),
      res,
      next,
    )({ eCommerceService });

    expect(eCommerceService.getOrderById).toHaveBeenCalledTimes(1);
    expect(eCommerceService.getOrderById).toHaveBeenCalledWith('0c6dc1ff-b678-475a-a8cd');
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(new AssertionError({ message: '0c6dc1ff-b678-475a-a8cd is not a UUID' }));
  });
});
