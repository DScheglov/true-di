import {
  describe, it, expect, jest, afterEach,
} from '@jest/globals';
import { ProductService } from '.';
import { EUR, money } from '../domain/money';
import { applyDiscount, Product } from '../domain/products';
import { IDiscountRateProvider } from '../interfaces/IDiscountService';
import { IProductsProvider } from '../interfaces/IProductRepo';

describe('ProductService', () => {
  const apples: Product = {
    id: '16cccd42-2dbf-4ef8-83e7-a6c51507b3d6',
    title: 'Apples',
    description: 'Just Apples',
    unitPrice: money(200, EUR),
    isFeatured: false,
  };

  const peaches: Product = {
    id: '8fddfc4b-5521-41da-bf33-f8c9bbc9e0ab',
    title: 'Peaches',
    description: 'Sweet Sweet Peaches',
    unitPrice: money(400, EUR),
    isFeatured: true,
  };

  const getProducts = jest.fn<IProductsProvider['getProducts']>();
  const getDiscountRate = jest.fn<IDiscountRateProvider['getDiscountRate']>();

  const productService = new ProductService({ getProducts }, { getDiscountRate });
  describe('getFeaturedProducts', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it('returns an empty list if there is no featered product', async () => {
      getProducts.mockResolvedValueOnce([]);
      getDiscountRate.mockResolvedValueOnce(0);

      await expect(productService.getFeaturedProducts()).resolves.toEqual([]);
    });

    it('requires the featured products only', async () => {
      getProducts.mockResolvedValueOnce([]);
      getDiscountRate.mockResolvedValueOnce(0);

      await productService.getFeaturedProducts();

      expect(getProducts).toHaveBeenCalledTimes(1);
      expect(getProducts).toHaveBeenCalledWith({ isFeatured: true });
    });

    it('returns undiscounted featured products if discountRate is 0%', async () => {
      getProducts.mockResolvedValueOnce([apples, peaches]);
      getDiscountRate.mockResolvedValueOnce(0);

      await expect(productService.getFeaturedProducts()).resolves.toEqual([apples, peaches]);
    });

    it('returns discounted featured products if discountRate is 5%', async () => {
      getProducts.mockResolvedValueOnce([apples, peaches]);
      getDiscountRate.mockResolvedValueOnce(0.05);

      await expect(productService.getFeaturedProducts()).resolves.toEqual(
        [apples, peaches].map(applyDiscount(0.05)),
      );
    });
  });
});
