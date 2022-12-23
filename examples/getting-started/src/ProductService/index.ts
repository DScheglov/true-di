import { applyDiscount } from '../domain/products';
import { IDiscountRateProvider } from '../interfaces/IDiscountService';
import { IProductsProvider } from '../interfaces/IProductRepo';
import { IProductService } from '../interfaces/IProductService';

export class ProductService implements IProductService {
  constructor(
    private readonly products: IProductsProvider,
    private readonly discountService: IDiscountRateProvider,
  ) {}

  async getFeaturedProducts() {
    const discountRate = await this.discountService.getDiscountRate();
    const featuredProducts = await this.products.getProducts({ isFeatured: true });

    return discountRate > 0
      ? featuredProducts.map(applyDiscount(discountRate))
      : featuredProducts;
  }
}
