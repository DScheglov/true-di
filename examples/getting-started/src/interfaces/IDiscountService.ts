export interface IDiscountRateProvider {
  getDiscountRate(): Promise<number>;
}

interface IDiscountService extends IDiscountRateProvider {}

export default IDiscountService;
