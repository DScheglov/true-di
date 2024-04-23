import { describe, expect, it } from '@jest/globals';
import main from './main';
import { ProductService } from './ProductService';
import { UserService } from './UserService';

describe('main', () => {
  it('allows to get create all module items', () => {
    expect({ ...main }).toEqual({
      userService: expect.any(UserService),
      productService: expect.any(ProductService),
      productController: expect.any(Object),
    });
  });
});
