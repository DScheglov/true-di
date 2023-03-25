export interface IDiscountRateProvider {
  getDiscountRate(): Promise<number>;
}

export interface IDiscountService extends IDiscountRateProvider {}
