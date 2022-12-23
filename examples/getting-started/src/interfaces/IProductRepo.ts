import { Product } from '../domain/products';

export interface IProductsProvider {
  getProducts(match?: Partial<Product>): Promise<Product[]>
}

export interface IProductRepo extends IProductsProvider {}
