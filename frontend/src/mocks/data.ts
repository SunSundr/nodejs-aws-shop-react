import { OrderStatus } from '~/constants/order';
import { CartItem } from '~/models/CartItem';
import { Order } from '~/models/Order';
import { AvailableProduct, Product } from '~/models/Product';

export const products: Product[] = [
  {
    description: 'Experience the ultimate power in a tiny package!',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    price: 24,
    title: 'Super Product',
  },
  {
    description: 'Add a dash of fun and whimsy to your day!',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a1',
    price: 15,
    title: 'Quirky Product',
  },
  {
    description: 'Unleash your inner groove with this vibrant item!',
    id: '7567ec4b-b10c-48c5-9345-fc73c48a80a3',
    price: 23,
    title: 'Funky Product',
  },
  {
    description: 'Elegance and charm wrapped in a stylish bundle!',
    id: '7567ec4b-b10c-48c5-9345-fc73348a80a1',
    price: 15,
    title: 'Dandy Product',
  },
  {
    description: 'Your new go-to gadget for everyday convenience.',
    id: '7567ec4b-b10c-48c5-9445-fc73c48a80a2',
    price: 23,
    title: 'Nifty Product',
  },
  {
    description: 'Bring a touch of wild and crazy fun into your life!',
    id: '7567ec4b-b10c-45c5-9345-fc73c48a80a1',
    price: 15,
    title: 'Zany Product',
  },
];

export const availableProducts: AvailableProduct[] = products.map((product, index) => ({
  ...product,
  count: index + 1,
}));

export const cart: CartItem[] = [
  {
    product: products[0],
    count: 2,
  },
  {
    product: products[5],
    count: 5,
  },
];

export const orders: Order[] = [
  {
    id: '1',
    delivery: {
      address: 'some address',
      firstName: 'Name',
      lastName: 'Surname',
      comment: '',
    },
    items: [
      { productId: products[0].id ?? 'error', category: 'default', count: 2 },
      { productId: products[5].id ?? 'error', category: 'default', count: 5 },
    ],
    statusHistory: [{ status: OrderStatus.OPEN, timestamp: Date.now(), comment: 'New order' }],
    currentStatus: OrderStatus.OPEN,
    cart: {},
    // total: 10,
    updatedAt: '',
    createdAt: '',
  },
  {
    id: '2',
    delivery: {
      address: 'another address',
      firstName: 'John',
      lastName: 'Doe',
      comment: 'Ship fast!',
    },
    items: [{ productId: products[0].id ?? 'error', category: 'default', count: 3 }],
    statusHistory: [
      {
        status: OrderStatus.SENT,
        timestamp: Date.now(),
        comment: 'Fancy order',
      },
    ],
    currentStatus: OrderStatus.SENT,
    cart: {},
    // total: 10,
    updatedAt: '',
    createdAt: '',
  },
];
