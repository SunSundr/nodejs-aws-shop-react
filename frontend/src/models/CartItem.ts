import { AvailableProduct, Product } from '~/models/Product';

export type CartItem = {
  product: Product | AvailableProduct;
  count: number;
  cartId?: string;
};
