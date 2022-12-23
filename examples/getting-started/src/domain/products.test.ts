import { describe, it, expect } from '@jest/globals';
import { EUR, money } from './money';
import { applyDiscount } from './products';

describe('products', () => {
  describe('applyDiscount', () => {
    it('discounts the product', () => {
      const apples = {
        id: '16cccd42-2dbf-4ef8-83e7-a6c51507b3d6',
        title: 'Apples',
        description: 'Just Apples',
        unitPrice: money(200, EUR),
        isFeatured: false,
      };

      expect(applyDiscount(0.05)(apples)).toEqual({
        id: '16cccd42-2dbf-4ef8-83e7-a6c51507b3d6',
        title: 'Apples',
        description: 'Just Apples',
        unitPrice: money(190, EUR),
        isFeatured: false,
        discount: money(10, EUR),
      });
    });
  });
});
