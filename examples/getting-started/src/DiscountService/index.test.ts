import {
  describe, it, expect, jest,
} from '@jest/globals';
import { DiscountService, NO_DISCOUNT, PREFERRED_CUSTOMER_DISCOUNT } from '.';
import { IUserProvider } from '../interfaces/IUserService';

describe('DiscountingService', () => {
  const getCurrentUser = jest.fn<IUserProvider['getCurrentUser']>();

  const discountingService = new DiscountService({ getCurrentUser });

  it('could be instantiated', () => {
    expect(discountingService).toBeDefined();
  });

  it('returns NO_DISCOUNT if current user is absent', async () => {
    getCurrentUser.mockResolvedValueOnce(null);

    await expect(discountingService.getDiscountRate()).resolves.toBe(NO_DISCOUNT);
  });

  it('returns NO_DISCOUNT if current user is not preferred', async () => {
    getCurrentUser.mockResolvedValueOnce({
      id: 'some-user-id',
      email: 'some-user@no-email.com',
      isPreferredCustomer: false,
    });

    await expect(discountingService.getDiscountRate()).resolves.toBe(NO_DISCOUNT);
  });

  it('returns PREFERRED_CUSTOMER_DISCOUNT if current user is preferred', async () => {
    getCurrentUser.mockResolvedValueOnce({
      id: 'some-user-id',
      email: 'some-user@no-email.com',
      isPreferredCustomer: true,
    });

    await expect(discountingService.getDiscountRate()).resolves.toBe(PREFERRED_CUSTOMER_DISCOUNT);
  });
});
