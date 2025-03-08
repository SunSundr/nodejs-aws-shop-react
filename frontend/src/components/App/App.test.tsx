import { MemoryRouter } from 'react-router-dom';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { expect, test } from 'vitest';
import App from '~/components/App/App';
import API_PATHS from '~/constants/apiPaths';
import { server } from '~/mocks/server';
import { CartItem } from '~/models/CartItem';
import { AvailableProduct } from '~/models/Product';
import { renderWithProviders } from '~/testUtils';
import { formatAsPrice } from '~/utils/utils';

test('Renders products list', async () => {
  const products: AvailableProduct[] = [
    {
      id: '1',
      title: 'Product 1',
      description: 'Product 1 description',
      price: 1,
      count: 1,
    },
    {
      id: '2',
      title: 'Product 2',
      description: 'Product 2 description',
      price: 2,
      count: 2,
    },
  ];
  server.use(
    http.get(`${API_PATHS.bff}/products`, () => {
      return HttpResponse.json(products, { status: 200 });
    }),
    http.get(`${API_PATHS.cart}/profile/cart`, () => {
      return HttpResponse.json<CartItem[]>([], { status: 200 });
    }),
  );
  renderWithProviders(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  await waitForElementToBeRemoved(() => screen.queryByText(/Loading/));
  products.forEach((product) => {
    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(formatAsPrice(product.price))).toBeInTheDocument();
  });
});
