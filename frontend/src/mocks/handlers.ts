import { http, HttpResponse } from 'msw';
import API_PATHS from '~/constants/apiPaths';
// import { availableProducts, orders, products, cart } from '~/mocks/data';
import { availableProducts, cart, orders } from '~/mocks/data';

export const handlers = [
  // not used ?
  // http.get(`${API_PATHS.bff}/product`, () => {
  //   return HttpResponse.json(products);
  // }),
  // products:
  http.get(`${API_PATHS.bff}/products`, () => {
    return HttpResponse.json(availableProducts);
  }),
  http.get(`${API_PATHS.bff}/products/:id`, ({ params }) => {
    const product = availableProducts.find((p) => p.id === params.id);
    return product ? HttpResponse.json(product) : HttpResponse.json(null, { status: 404 });
  }),
  http.put(`${API_PATHS.bff}/products`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.post(`${API_PATHS.bff}/products`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.delete(`${API_PATHS.bff}/products/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  //----------------------------------------------
  // profile:
  http.get(`${API_PATHS.bff}/cart`, () => {
    return HttpResponse.json(cart);
  }),
  http.put(`${API_PATHS.bff}/cart`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  // order:
  http.get(`${API_PATHS.bff}/cart/order`, () => {
    return HttpResponse.json(orders);
  }),
  http.put(`${API_PATHS.bff}/cart/order`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  //----------------------------------------------
  http.get(`${API_PATHS.bff}/cart/order/:id`, ({ params }) => {
    const order = orders.find((o) => o.id === params.id);
    return order ? HttpResponse.json(order) : HttpResponse.json(null, { status: 404 });
  }),
  http.delete(`${API_PATHS.bff}/cart/order/:id`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.put(`${API_PATHS.bff}/cart/order/:id/status`, () => {
    return HttpResponse.json(null, { status: 200 });
  }),
];
