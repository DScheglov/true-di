import {
  describe, expect, it, jest,
} from '@jest/globals';
import Express from 'express';
import { IFeaturedProductProvider } from '../interfaces/IProductService';
import { getFeaturedProducts } from '.';

function returnThis<T>(this: T) { return this; }

const fakeResponse = (): Express.Response => ({
  status: jest.fn(returnThis),
  type: jest.fn(returnThis),
  send: jest.fn(returnThis),
}) as any;

const fakeRequest = <P extends {} >(params: P = {} as P): Express.Request<P> => ({ params }) as any;

describe('productsController.getFeaturedProducts', () => {
  const productService = {
    getFeaturedProducts: jest.fn<IFeaturedProductProvider['getFeaturedProducts']>(),
  };

  it('sends json received from the productsService.getFeaturedProducts', async () => {
    expect.assertions(4);

    const res = fakeResponse();
    const next = jest.fn();

    productService.getFeaturedProducts.mockResolvedValueOnce([]);
    await getFeaturedProducts(fakeRequest(), res)({ productService });

    expect(productService.getFeaturedProducts).toHaveBeenCalledTimes(1);
    expect(res.type).toHaveBeenCalledWith('application/json');
    expect(res.send).toHaveBeenCalledWith('[]');
    expect(next).not.toHaveBeenCalled();
  });
});
