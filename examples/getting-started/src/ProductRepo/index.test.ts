import { describe, it, expect } from '@jest/globals';
import { ProductRepo } from '.';
import { EUR, money } from '../domain/money';
import { Product } from '../domain/products';

describe('Product Repo', () => {
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

  const productRepo = new ProductRepo([
    apples,
    peaches,
  ]);

  describe('getProducts', () => {
    it('returns all products', async () => {
      await expect(productRepo.getProducts()).resolves.toEqual([apples, peaches]);
    });

    it('returns featured products', async () => {
      await expect(productRepo.getProducts({ isFeatured: true })).resolves.toEqual([peaches]);
    });

    it('returns non-featured products', async () => {
      await expect(productRepo.getProducts({ isFeatured: false })).resolves.toEqual([apples]);
    });

    it('returns an empty list of products if no product match', async () => {
      await expect(productRepo.getProducts({ id: 'e269d62c-5de9-4bc7-a462-7cc2e3341e94' })).resolves.toEqual([]);
    });
  });
});
