export type OrderItem = {
  id: string;
  orderId: string;
  sku: string;
  unitPrice: number;
  quantity: number;
}

export type Order = {
  id: string;
  items: OrderItem[],
  total: number,
}
