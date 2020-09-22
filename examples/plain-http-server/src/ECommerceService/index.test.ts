import { AssertionError } from 'assert';
import ECommerceService from '.';
import {
  IDataSourceService, IECommerceService, IInfoLogger, OrderItem,
} from '../interfaces';
import { ordersFromItems } from '../Orders';

const fakeOrderItems = [
  {
    id: '9acec35f-2402-40a7-92cc-664a4ade4778',
    orderId: '9b85794c-80d2-4f79-b024-901d0cb230a7',
    sku: 'stock-id:1397',
    unitPrice: 215.1,
    quantity: 5,
  },
  {
    id: '845ef455-0531-487b-b1b9-8d8adf55e606',
    orderId: '9b85794c-80d2-4f79-b024-901d0cb230a7',
    sku: 'stock-id:8255',
    unitPrice: 692.63,
    quantity: 1,
  },
  {
    id: 'd2a87c78-e7c2-42ee-9ad0-d88cbd151841',
    orderId: '9b85794c-80d2-4f79-b024-901d0cb230a7',
    sku: 'stock-id:6393',
    unitPrice: 360.5,
    quantity: 2,
  },
  {
    id: '20e7ba33-7bd3-4390-853b-55bcad49562b',
    orderId: '8db5d840-3a8b-45fe-a6e2-1b202f716717',
    sku: 'stock-id:8439',
    unitPrice: 530.7,
    quantity: 9,
  },
  {
    id: '9c686fa1-d490-4196-89c5-01a423b35876',
    orderId: '9b85794c-80d2-4f79-b024-901d0cb230a7',
    sku: 'stock-id:1667',
    unitPrice: 544.99,
    quantity: 7,
  },
];

describe('ECommerceService', () => {
  it('returns orders with method .getOrders', async () => {
    expect.assertions(1);

    const fakeLogger: IInfoLogger = {
      info: jest.fn(),
    };

    const fakeDataSource: IDataSourceService = {
      getOrderItems: jest.fn().mockResolvedValue(fakeOrderItems),
    };
    const ecommerceService: IECommerceService = ECommerceService(
      { logger: fakeLogger, dataSourceService: fakeDataSource },
    );

    expect(await ecommerceService.getOrders()).toEqual(ordersFromItems(fakeOrderItems));
  });

  it('returns order with method .getOrderById', async () => {
    expect.assertions(1);

    const fakeLogger: IInfoLogger = {
      info: jest.fn(),
    };

    const fakeDataSource = {
      getOrderItems: jest.fn(
        (predicate?: (orderItem: OrderItem) => boolean) =>
          Promise.resolve(fakeOrderItems.filter(predicate)),
      ),
    };
    const ecommerceService: IECommerceService = ECommerceService(
      { logger: fakeLogger, dataSourceService: fakeDataSource },
    );

    expect(
      await ecommerceService.getOrderById(fakeOrderItems[0].orderId),
    ).toEqual(ordersFromItems(fakeOrderItems)[0]);
  });

  it('returns null with method .getOrderById if no order is found', async () => {
    expect.assertions(1);

    const fakeLogger: IInfoLogger = {
      info: jest.fn(),
    };

    const fakeDataSource = {
      getOrderItems: jest.fn().mockResolvedValue([]),
    };

    const ecommerceService: IECommerceService = ECommerceService(
      { logger: fakeLogger, dataSourceService: fakeDataSource },
    );
    expect(
      await ecommerceService.getOrderById('9acec35f-2402-40a7-92cc-664a4ade4778'),
    ).toEqual(null);
  });

  it('throws AssertionError with method .getOrderById if id is not a UUID', async () => {
    expect.assertions(1);

    const fakeLogger: IInfoLogger = {
      info: jest.fn(),
    };

    const fakeDataSource = {
      getOrderItems: jest.fn().mockResolvedValue([]),
    };

    const ecommerceService: IECommerceService = ECommerceService(
      { logger: fakeLogger, dataSourceService: fakeDataSource },
    );

    const error = await ecommerceService.getOrderById('9acec35f-2402-40a7-92cc').catch(err => err);

    expect(error).toBeInstanceOf(AssertionError);
  });
});
