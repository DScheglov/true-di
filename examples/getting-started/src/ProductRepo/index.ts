import { Product } from '../domain/products';
import { IProductRepo } from '../interfaces/IProductRepo';
import { matches } from '../utils/matches';

export class ProductRepo implements IProductRepo {
  constructor(private readonly products: Product[]) {}

  async getProducts(match?: Partial<Product>): Promise<Product[]> {
    return match != null ? this.products.filter(matches(match)) : this.products.slice();
  }
}