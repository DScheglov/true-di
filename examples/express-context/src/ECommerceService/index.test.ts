import ECommerceService from '.';
import { IDataSourceService, IECommerceService, ILogger } from '../interfaces';
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

const fakeLogger: ILogger = {
  info: jest.fn(),
} as any;

const fakeDataSource: IDataSourceService = {
  getOrderItems: jest.fn().mockResolvedValue(fakeOrderItems),
} as any;

describe('ECommerceService', () => {
  it('allows to instantiate ecommerceService', () => {
    const ecommerceService: IECommerceService = new ECommerceService(fakeLogger, fakeDataSource);

    expect(ecommerceService).toBeInstanceOf(ECommerceService);
  });

  it('returns orders with method .getOrders', async () => {
    const ecommerceService: IECommerceService = new ECommerceService(fakeLogger, fakeDataSource);

    expect(await ecommerceService.getOrders()).toEqual(ordersFromItems(fakeOrderItems));
  });
});
