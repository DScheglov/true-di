import { applyDiscount } from '../domain/products';
import {
  IDiscountRateProvider,
  IProductService,
  IProductsProvider,
} from '../interfaces';

export class ProductService implements IProductService {
  constructor(
    private readonly products: IProductsProvider,
    private readonly discountService: IDiscountRateProvider,
  ) {
    console.log('Creating a Product Service');
  }

  async getFeaturedProducts() {
    const discountRate = await this.discountService.getDiscountRate();
    const featuredProducts = await this.products.getProducts({ isFeatured: true });

    return discountRate > 0
      ? featuredProducts.map(applyDiscount(discountRate))
      : featuredProducts;
  }
}
