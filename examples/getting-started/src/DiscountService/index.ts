import { IDiscountService, IUserProvider } from '../interfaces';

export const PREFERRED_CUSTOMER_DISCOUNT: number = 0.05;
export const NO_DISCOUNT: number = 0;

export class DiscountService implements IDiscountService {
  constructor(
    private readonly userService: IUserProvider,
  ) {
    console.log('Creating a Discounting Service');
  }

  async getDiscountRate() {
    const user = await this.userService.getCurrentUser();
    return user != null && user.isPreferredCustomer
      ? PREFERRED_CUSTOMER_DISCOUNT
      : NO_DISCOUNT;
  }
}
