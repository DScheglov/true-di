import type { Request, Response } from 'express';
import { JSONMoneyReplacer } from './domain/money';
import { IFeaturedProductProvider } from './interfaces/IProductService';

type GetFeaturedProductsDeps = {
  productService: IFeaturedProductProvider;
}

export const getFeaturedProducts =
  (req: Request, res: Response) =>
    async ({ productService }: GetFeaturedProductsDeps) => {
      const featuredProducts = await productService.getFeaturedProducts();

      res
        .status(200)
        .type('application/json')
        .send(JSON.stringify(featuredProducts, JSONMoneyReplacer, 2));
    };
