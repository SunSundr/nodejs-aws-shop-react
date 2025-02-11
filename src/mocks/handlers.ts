import { http, HttpResponse } from 'msw';
import API_PATHS from '~/constants/apiPaths';
import { availableProducts, orders, products, cart } from '~/mocks/data';

export const handlers = [
  http.get(`${API_PATHS.bff}/product`, () => {
    return HttpResponse.json(products);
  }),
  http.put(`${API_PATHS.bff}/product`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.delete(`${API_PATHS.bff}/product/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.get(`${API_PATHS.bff}/product/available`, () => {
    return HttpResponse.json(availableProducts);
  }),
  http.get(`${API_PATHS.bff}/product/:id`, ({ params }) => {
    const product = availableProducts.find((p) => p.id === params.id);
    return product ? HttpResponse.json(product) : HttpResponse.json(null, { status: 404 });
  }),
  http.get(`${API_PATHS.cart}/profile/cart`, () => {
    return HttpResponse.json(cart);
  }),
  http.put(`${API_PATHS.cart}/profile/cart`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.get(`${API_PATHS.order}/order`, () => {
    return HttpResponse.json(orders);
  }),
  http.put(`${API_PATHS.order}/order`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.get(`${API_PATHS.order}/order/:id`, ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    return order ? HttpResponse.json(order) : HttpResponse.json(null, { status: 404 });
  }),
  http.delete(`${API_PATHS.order}/order/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.put(`${API_PATHS.order}/order/:id/status`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
];
