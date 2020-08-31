import Express from 'express';
import { getOrdersFactory } from './controller';
import { IECommerceService, Order } from './interfaces';

const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const fakeEcommerceService = (orders: Order[]): IECommerceService => ({
  getOrders: jest.fn(async (): Promise<Order[]> => orders),
});

function returnThis() { return this; }

const fakeResponse = (): Express.Response => ({
  type: jest.fn(returnThis),
  send: jest.fn(returnThis),
}) as any;

describe('controller.getOrders', () => {
  it('sends json recieved from the ecommerceService.getOrders', async () => {
    expect.assertions(3);

    const ecommerceService = fakeEcommerceService([]);
    const res = fakeResponse();

    const getOrders = getOrdersFactory({ ecommerceService });

    getOrders(null, res);

    await delay(0);

    expect(ecommerceService.getOrders).toHaveBeenCalledTimes(1);
    expect(res.type).toHaveBeenCalledWith('application/json');
    expect(res.send).toHaveBeenCalledWith('[]');
  });
});
