import { AvailableProduct } from '~/models/Product';

const priceFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatAsPrice = (price: number) => priceFormatter.format(price);

export function sortProductsById(products: AvailableProduct[]): AvailableProduct[] {
  return products.sort((a, b) => {
    if (a.id === undefined) return 1;
    if (b.id === undefined) return -1;
    return a.id.localeCompare(b.id);
  });
}
