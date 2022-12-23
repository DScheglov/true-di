import { map, Money } from './money';

export type Product = Readonly<{
  id: string;
  title: string;
  description: string;
  unitPrice: Money;
  isFeatured: boolean;
  discount?: Money;
}>;

export const applyDiscount = (discountRate: number) => (product: Product): Product => {
  const discount = map(product.unitPrice, amount => amount * discountRate);

  return {
    ...product,
    unitPrice: map(product.unitPrice, amount => amount - discount.amount),
    discount,
  };
};
