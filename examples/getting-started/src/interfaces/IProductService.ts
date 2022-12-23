import { Product } from '../domain/products';

export interface IFeaturedProductProvider {
  getFeaturedProducts(): Promise<Product[]>;
}

export interface IProductService extends IFeaturedProductProvider {}
